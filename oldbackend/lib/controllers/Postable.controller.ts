import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";

import { makePost } from "./Posts.controller";
import { PostableType } from "../models/Post.model";

export const getN4jNodeName = (postable_type: string): string => {
  switch (postable_type) {
    case PostableType.Plant:
      return "Plant";
    case PostableType.Garden:
      return "Garden";
    case PostableType.Device:
      return "Device";
    case PostableType.Post:
      return "Post";
  }
};

export const heartPostable = async (req: Request, res: Response) => {
  console.log(req.params.rid, req.params.did, req.params.pid);
  await cypher(
    `
        MATCH (o:${getN4jNodeName(
          res.locals.type
        )} {_id:$oid}), (u:User {_id:$uid})
        WHERE o:Plant OR o:Garden OR o:Device OR o:Post
        MERGE (u)-[h:HEARTS]->(o)
    `,
    {
      oid: req.params.rid ?? req.params.did ?? req.params.pid,
      uid: req.session.user.id,
    }
  );

  res.status(HTTP.OK).end();
};

export const unheartPostable = async (req: Request, res: Response) => {
  await cypher(
    `
        MATCH (u:User {_id:$uid})-[h:HEARTS]->(o:${getN4jNodeName(
          res.locals.type
        )} {_id:$oid})
        WHERE o:Plant OR o:Garden OR o:Device OR o:Post
        DELETE h
    `,
    {
      oid: req.params.rid ?? req.params.did ?? req.params.pid,
      uid: req.session.user.id,
    }
  );

  res.status(HTTP.OK).end();
};

export const repostPostable = async (req: Request, res: Response) => {
  let post = makePost(req.body.content || "");
  let result = await cypher(
    `
        MATCH (o {_id:$oid}), (u:User {_id:$uid})
        WHERE o:Plant OR o:Garden OR o:Device OR o:Post
        CREATE (u)-[:POSTED]->(r:Post $body)-[:REPOST_OF]->(o)
        RETURN r
    `,
    {
      oid: req.params.rid ?? req.params.did ?? req.params.pid,
      uid: req.session.user.id,
      body: post,
    }
  );

  if (!result.records.length)
    throw new ErrorHandler(HTTP.ServerError, "Did not create repost");
  res.status(201).json(result.records[0].get("r").properties);
};

export const replyToPostable = async (req: Request, res: Response) => {
  //todo: disable ability to reply to a 'repost with no reply'
  let post = makePost(req.body.content);
  let result = await cypher(
    `
        MATCH (o {_id:$oid}), (u:User {_id:$uid})
        WHERE o:Plant OR o:Garden OR o:Device OR o:Post
        CREATE (u)-[:POSTED]->(r:Post $body)-[:REPLY_TO]->(p)
        RETURN r
    `,
    {
      oid: req.params.rid ?? req.params.did ?? req.params.pid,
      uid: req.session.user.id,
      body: post,
    }
  );

  if (!result.records.length)
    throw new ErrorHandler(HTTP.ServerError, "Did not create reply");
  res.status(201).json(result.records[0].get("r").properties);
};
