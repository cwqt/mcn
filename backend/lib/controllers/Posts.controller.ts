import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Post, IPostModel }         from '../models/Post.model';

import {Types} from 'mongoose'
import neode from '../common/neo4j';

export const createPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (u:User {_id:$uid})
        CREATE (p:Post {content:$content, _id:$pid, created_at:$created_at})<-[:POSTED]-(u)
        RETURN p
    `, {
        uid: req.params.uid,
        content: req.body.content,
        pid: new Types.ObjectId().toHexString(),
        created_at: new Date().toISOString()
    })

    res.status(201).json(result.records[0].get('p').properties);
}

export const readAllPosts = async (req:Request, res:Response, next:NextFunction) => {
    const order_by = (req.query.order || 'title') as string;
    const sort = (req.query.sort || 'ASC') as string;
    const limit = (req.query.limit || 10) as number;
    const page = (req.query.page || 1) as number;
    const skip = (page-1) * limit;

    let result = await neode.instance.cypher(`
        MATCH (post:Post)<-[:POSTED]-(:User {_id:$uid})
        RETURN post
    `, {
        uid: req.params.uid
    })
    
    let posts:any = result.records.map(record => record.get('post').properties);
    res.json(posts);
}

export const readPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (p:Post {_id:$pid})
        RETURN p
    `, {
        pid: req.params.pid,
    })

    if(!result.records.length) throw new ErrorHandler(HTTP.NotFound, "No such post")
    res.json(result.records[0].get('p').properties);
}

export const repostPost = async (req:Request, res:Response, next:NextFunction) => {
    // /users/:uid/posts/:pid/repost -- user uid is reposting post with pid
    //todo: disable ability to repost a repost w/ no content
    let result = await neode.instance.cypher(`
        MATCH (p:Post {_id:$pid}), (u:User {_id:$uid})
        CREATE (u)-[:POSTED]->(r:Post {content:$content, _id:$npid, created_at:$created_at})-[:REPOST_OF]->(p)
        RETURN r
    `, {
        pid: req.params.pid,
        uid: req.params.uid,
        npid: new Types.ObjectId().toHexString(),
        created_at: new Date().toISOString(),
        content: req.body.content || null
    })
    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create repost")
    res.status(201).json(result.records[0].get('r').properties);
}

export const replyToPost = async (req:Request, res:Response, next:NextFunction) => {
    //todo: disable ability to reply to a 'repost with no reply'
    let result = await neode.instance.cypher(`
        MATCH (p:Post {_id:$pid}), (u:User {_id:$uid})
        CREATE (u)-[:POSTED]->(r:Post {content:$content, _id:$npid, created_at:$created_at})-[:REPLY_TO]->(p)
        RETURN r
    `, {
        pid: req.params.pid,
        uid: req.params.uid,
        npid: new Types.ObjectId().toHexString(),
        created_at: new Date().toISOString(),
        content: req.body.content
    })
    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create reply")
    res.status(201).json(result.records[0].get('r').properties);
}

export const updatePost = (req:Request, res:Response, next:NextFunction) => {
}

export const deletePost = (req:Request, res:Response, next:NextFunction) => {
}
