import { Request, Response } from "express";
import { Types } from "mongoose";

import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";
import { filterUserFields } from "./User.controller";
import { RecordableType } from "../models/Recordable.model";
import { IDeviceStub } from "../models/Device/Device.model";
import { getDeviceState } from "./Device/Device.controller";
import { IRecordableStub } from "../models/Recordable.model";
import { IPost, IPostStub, IRepost, RepostType } from "../models/Post.model";

export const makePost = (content: string | null, repost?: any): IPostStub => {
  let post: IPostStub = {
    _id: Types.ObjectId().toHexString(),
    content: content,
    created_at: Date.now(),
  };
  if (repost) post["repost"] = repost;
  return post;
};

export const createPost = async (req: Request, res: Response) => {
  let post = makePost(req.body.content);
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        CREATE (p:Post $body)<-[:POSTED]-(u)
        RETURN p
    `,
    {
      uid: req.params.uid,
      body: post,
    }
  );

  res.status(201).json(result.records[0].get("p").properties);
};

export const readAllPosts = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})-[:POSTED]->(p:Post)
        OPTIONAL MATCH (p)-[:REPOST_OF]->(o)<-[:POSTED|:CREATED]-(op:User)
        WHERE o:Plant OR o:Garden OR o:Device OR o:Post
        WITH p, o, op,
            SIZE((p)<-[:REPOST_OF]-(:Post)) AS reposts,
            SIZE((p)<-[:REPLY_TO]-(:Post)) AS replies,
            SIZE((p)<-[:HEARTS]-(:User)) AS hearts          
        RETURN p, reposts, replies, hearts, o, op,
            EXISTS ((:User {_id:$selfid})-[:HEARTS]->(p)) AS isHearting,
            EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(p)) AS hasReposted
    `,
    {
      uid: req.params.uid,
      selfid: req.session.user.id,
    }
  );

  console.log(result.records.length);

  let posts: IPostStub[] = result.records.map((record: any) => {
    let p = record.get("p").properties;
    let o = record.get("o");
    let repost: IRepost;

    if (o != undefined) {
      switch (o.labels[0].toLowerCase()) {
        case "post":
          repost = {
            type: RepostType.Post,
            author: filterUserFields(record.get("op").properties, true),
            content: {
              _id: o.properties._id,
              content: o.properties.content,
              images: o.properties.images,
              created_at: o.properties.created_at,
            } as IPostStub,
          } as IRepost;
          break;

        case RecordableType.Device:
          repost = {
            type: RepostType.Device,
            author: filterUserFields(record.get("op").properties, true),
            content: {
              _id: o.properties._id,
              name: o.properties.name,
              thumbnail: o.properties.thumbnail,
              verified: o.properties.verified,
              state: getDeviceState(o.properties),
              last_ping: o.properties.last_ping,
              created_at: o.properties.created_at,
              hardware_model: o.properties.hardware_model,
              network_name: o.properties.network_name,
            } as IDeviceStub,
          } as IRepost;
          break;

        case RecordableType.Plant || RecordableType.Garden:
          repost = {
            type: RepostType.Recordable,
            author: filterUserFields(record.get("op").properties, true),
            content: {
              _id: o.properties._id,
              name: o.properties.name,
              thumbnail: o.properties.thumbnail,
              created_at: o.properties.created_at,
              type: o.properties.labels[0].toLowerCase(),
            } as IRecordableStub,
          } as IRepost;
          break;
      }
    }

    let post: IPostStub = {
      _id: p._id,
      content: p.content,
      created_at: p.created_at,
      repost: repost,
      meta: {
        isHearting: record.get("isHearting") ? true : false,
        hasReposted: record.get("hasReposted") ? true : false,
        hearts: record.get("hearts").toNumber(),
        reposts: record.get("reposts").toNumber(),
        replies: record.get("replies").toNumber(),
      },
    };

    return post;
  });

  res.json(posts);
};

export const readPost = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (p:Post {_id:$pid})
        OPTIONAL MATCH (:User {_id:$selfid})-[isHearting:HEARTS]->(p)
        OPTIONAL MATCH (:User {_id:$selfid})-[:POSTED]->(:Post)-[hasReposted:REPOST_OF]->(p)
        WITH p,
            size((p)<-[:REPOST_OF]-(:Post)) AS reposts,
            size((p)<-[:REPLY_TO]-(:Post)) AS replies,
            size((p)<-[:HEARTS]-(:User)) AS hearts        
        RETURN p, reposts, replies, hearts,
            EXISTS ((:User {_id:$selfid})-[:HEARTS]->(p)) AS isHearting,
            EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(p)) AS hasReposted
    `,
    {
      pid: req.params.pid,
      selfid: req.session.user.id,
    }
  );

  if (!result.records.length)
    throw new ErrorHandler(HTTP.NotFound, "No such post");

  let p = result.records[0].get("p").properties;
  let post: IPost = {
    _id: p._id,
    content: p.content,
    meta: {
      hearts: result.records[0].get("hearts").toNumber(),
      reposts: result.records[0].get("reposts").toNumber(),
      replies: result.records[0].get("replies").toNumber(),
      isHearting: result.records[0].get("isHearting") ? true : false,
      hasReposted: result.records[0].get("hasReposted") ? true : false,
    },
  };

  res.json(post);
};

export const updatePost = (req: Request, res: Response) => {};

export const deletePost = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (p:Post { _id:$pid })
        DELETE p
    `,
    {
      pid: req.params.pid,
    }
  );

  if (!result.summary.counters.containsUpdates())
    throw new ErrorHandler(HTTP.ServerError, "Could not delete post");
  res.status(200).end();
};
