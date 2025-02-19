import { Request, Response } from "express";
import { cypher } from "../../common/dbs";
import { Types } from "mongoose";

import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import { ITaskRoutine, ITask, TaskState, NodeType } from "@cxss/interfaces";

export const getTaskRoutines = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (d:Device {_id:$did})-[:HAS_ROUTINE]->(tr:TaskRoutine)
        MATCH (tr)-[:START]->(start:Task)
        OPTIONAL MATCH (start)-[:NEXT*0..]->(t)
        RETURN tr, start, collect(t) AS t
    `,
    {
      did: req.params.did,
    }
  );

  let routines: ITaskRoutine[] = result.records.map((record: any) => {
    return {
      ...record.get("tr").properties,
      tasks: record.get("t")?.map((x: any) => x.properties),
    };
  });

  res.json(routines);
};

export const createTaskRoutine = async (req: Request, res: Response) => {
  let routine: ITaskRoutine = {
    _id: Types.ObjectId().toHexString(),
    name: req.body.name,
    cron: req.body.cron,
    type: NodeType.TaskRoutine,
    timezone: req.body.interval,
    execution_count: 0,
    created_at: Date.now(),
    state: TaskState.Inactive,
  };

  let result = await cypher(
    `
        MATCH (d:Device {_id:$did})
        CREATE (t:TaskRoutine $body)<-[:HAS_ROUTINE]-(d)
        RETURN t
    `,
    {
      did: req.params.did,
      body: routine,
    }
  );

  if (!result.records[0]?.get("t"))
    throw new ErrorHandler(HTTP.ServerError, "Did not create TaskRoutine");
  res.status(HTTP.Created).json(result.records[0].get("t").properties);
};

export const readRoutine = async (req: Request, res: Response) => {};

export const updateRoutine = async (req: Request, res: Response) => {};

export const deleteRoutine = async (req: Request, res: Response) => {};

export const executeRoutine = async (req: Request, res: Response) => {};

// TASKS ==========================================================================================

export const createTaskInRoutine = async (req: Request, res: Response) => {
  let task: ITask = {
    _id: Types.ObjectId().toHexString(),
    state: TaskState.Inactive,
    name: req.body.name,
    type: NodeType.Task,
    command: req.body.command,
    created_at: Date.now(),
    error: "",
  };

  //check routine exists & for start node
  let result = await cypher(
    `
        MATCH (tr:TaskRoutine {_id:$trid})
        OPTIONAL MATCH (tr)-[:START]->(startNode:Task)
        RETURN tr, startNode
    `,
    {
      trid: req.params.trid,
    }
  );

  let taskRoutine = result.records[0]?.get("tr")?.properties;
  if (!taskRoutine) throw new ErrorHandler(HTTP.NotFound, "No such TaskRoutine");
  if (taskRoutine.locked)
    throw new ErrorHandler(HTTP.BadRequest, "Cannot add new task while routine in progress");

  let startNode = result.records[0].get("startNode")?.properties;
  if (!startNode) {
    // first node
    let result = await cypher(
      `
            MATCH (tr:TaskRoutine {_id:$trid})
            CREATE (tr)-[:START]->(t:Task $body)-[:END]->(tr)
            RETURN t
        `,
      {
        trid: req.params.trid,
        body: task,
      }
    );

    if (!result.records[0]?.get("t")?.properties)
      throw new ErrorHandler(HTTP.ServerError, "Did not create Task");
    return res.status(HTTP.Created).json(result.records[0].get("t").properties);
  }

  //not first node, but a continuation
  result = await cypher(
    `
        MATCH (tr:TaskRoutine {_id:$trid}), (lastNode:Task)-[end:END]->(tr)
        CREATE (lastNode)-[:NEXT]->(t:Task $body)-[:END]->(tr)
        DELETE end
        RETURN t
    `,
    {
      trid: req.params.trid,
      body: task,
    }
  );

  if (!result.records[0]?.get("t")?.properties)
    throw new ErrorHandler(HTTP.ServerError, "Did not create Task");
  res.status(HTTP.Created).json(result.records[0].get("t").properties);
};

export const updateTask = async (req: Request, res: Response) => {};

export const deleteTask = async (req: Request, res: Response) => {};

export const executeTask = async (req: Request, res: Response) => {};
