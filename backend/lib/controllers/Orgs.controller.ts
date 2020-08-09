import { Request, Response, NextFunction } from "express";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";

import Org from "../classes/Orgs.model";
import {
  NodeType,
  OrgItemType,
  IOrg,
  IOrgStub,
  Paginated,
  DataModel,
  IOrgEnv,
} from "@cxss/interfaces";
import { capitalize, paginate } from "./Node.controller";
import { ErrorHandler } from "../common/errorHandler";
const { body, param, query } = require("express-validator");
import { validate } from "../common/validate";
import { IResLocals, Access } from "../mcnr";
import { Record } from "neo4j-driver";
import { Types } from "mongoose";

export const validators = {
  createOrg: validate([body("name").not().isEmpty().trim()]),
  validOrgNodeType: validate([query("type").isIn(Object.values(OrgItemType))]),
};

export const readAllOrgs = async (
  req: Request,
  next: NextFunction,
  locals: IResLocals
): Promise<Paginated<IOrgStub>> => {
  const res = await cypher(
    ` MATCH (o:Organisation)
      WITH o, count(o) as total
      RETURN o{._id}, total
      SKIP toInteger($skip) LIMIT toInteger($limit)`,
    {
      skip: locals.pagination.page * locals.pagination.per_page,
      limit: locals.pagination.per_page,
    }
  );

  let orgs = await Promise.all(
    res.records.map((r: Record) => Org.read<IOrgStub>(r.get("")._id, DataModel.Stub))
  );

  return paginate(
    NodeType.Organisation,
    orgs,
    res.records[0].get("total").toNumber(),
    locals.pagination.per_page
  );
};

export const deleteOrg = async (req: Request) => {
  await Org.remove(req.params.oid);
};
export const updateOrg = async (req: Request): Promise<IOrg> => {
  return await Org.update(req.params.oid, req.body);
};

export const createOrg = async (req: Request): Promise<IOrg> => {
  const org: IOrgStub = {
    name: req.body.name,
    _id: new Types.ObjectId().toHexString(),
    created_at: Date.now(),
    type: NodeType.Organisation,
  };

  return await Org.create(org, req.session.user._id);
};

import Device from "../classes/IoT/Device.model";
import User from "../classes/Users/User.model";
import Farm from "../classes/Hydroponics/Farm.model";
const nodeMap: { [index in NodeType]?: any } = {
  [NodeType.Device]: Device,
  [NodeType.User]: User,
  [NodeType.Farm]: Farm,
};

export const readOrgNodes = (node: NodeType) => {
  return async (req: Request, next: NextFunction, locals: IResLocals): Promise<Paginated<any>> => {
    // https://stackoverflow.com/questions/54233387/get-total-count-and-paginated-result-in-one-cypher-query-neo4j
    let result = await cypher(
      `
      MATCH (o:Organisation {_id:$oid})
      WITH o, size((:${capitalize(node)})-[:IN]->(o)) as total
      MATCH (n:${capitalize(node)})-[:IN]->(o)
      RETURN n{._id}, total
      SKIP toInteger($skip) LIMIT toInteger($limit)
    `,
      {
        oid: req.params.oid,
        skip: locals.pagination.page * locals.pagination.per_page,
        limit: locals.pagination.per_page,
      }
    );

    let nodes = await Promise.all(
      result.records.map((r: Record) => {
        return nodeMap[node].read(r.get("n")._id, DataModel.Stub);
      })
    );

    return paginate(
      node,
      nodes,
      result.records[0]?.get("total")?.toNumber() || 0,
      locals.pagination.per_page,
      req.params.oid
    );
  };
};

export const addNodeToOrg = (node: NodeType) => {
  return async (req: Request, next: NextFunction) => {
    let relationship: any = {};
    if (node == NodeType.User) relationship.role = Access.OrgMember;

    let result = await cypher(
      `
        MATCH (o:Organisation {_id:$oid})
        MATCH (n:${capitalize(node)} {_id:$iid})
        MERGE (n)-[isIn:IN]->(o)
        RETURN isIn
      `,
      {
        oid: req.params.oid,
        iid: req.params.iid,
        rbody: relationship,
      }
    );

    if (!result.records[0]?.get("isIn"))
      throw new Error(`Couldn't add ${capitalize(node)} to Organisation.`);

    return;
  };
};

export const editUserRole = async (req: Request) => {};

export const getEnvironment = async (req: Request): Promise<IOrgEnv> => {
  let res = await cypher(
    `
    MATCH (o:${capitalize(NodeType.Organisation)} {_id:$oid})
    WITH o, 
      SIZE((:${capitalize(NodeType.Farm)})-[:IN]->(o)) as farmCount,
      SIZE((:${capitalize(NodeType.User)})-[:IN]->(o)) as userCount,
      SIZE((:${capitalize(NodeType.Device)})-[:IN]->(o)) as deviceCount

    OPTIONAL MATCH (f:${capitalize(NodeType.Farm)})-[:IN]->(o)
    WITH farmCount, userCount, deviceCount, f,
      SIZE((:${capitalize(NodeType.Rack)})<-[:HAS_RACK]-(f)) as rackCount

    OPTIONAL MATCH (r:${capitalize(NodeType.Rack)})<-[:HAS_RACK]-(f)
    WITH farmCount, userCount, deviceCount, rackCount, r, 
      SIZE((:${capitalize(NodeType.Crop)})<-[:HAS_CROP]-(r)) as cropCount

    RETURN farmCount, userCount, deviceCount, rackCount, cropCount
    `,
    {
      oid: req.params.oid,
    }
  );
  console.log(res);

  let env: IOrgEnv = {
    devices: res.records[0].get("deviceCount")?.toNumber() || 0,
    alerts: 0,
    farms: res.records[0].get("farmCount")?.toNumber() || 0,
    racks: res.records[0].get("rackCount")?.toNumber() || 0,
    crops: res.records[0].get("cropCount")?.toNumber() || 0,
    users: res.records[0].get("userCount")?.toNumber() || 0,
    dashboard: {},
  };

  return env;
};
