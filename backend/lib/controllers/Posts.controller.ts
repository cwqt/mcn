import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Types } from 'mongoose'
import neode from '../common/neo4j';

import { filterUserFields } from './User.controller'

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
    // const order_by = (req.query.order || 'title') as string;
    // const sort = (req.query.sort || 'ASC') as string;
    // const limit = (req.query.limit || 10) as number;
    // const page = (req.query.page || 1) as number;
    // const skip = (page-1) * limit;

    let result = await neode.instance.cypher(`
        MATCH (u:User {_id:$uid})-[:POSTED]->(p:Post)
        OPTIONAL MATCH (p)-[:REPOST_OF]->(p2:Post)<-[:POSTED]-(u2:User)
        WITH p, p2, u2,
            size((p)<-[:REPOST_OF]-(:Post)) AS reposts,
            size((p)<-[:REPLY_TO]-(:Post)) AS replies,
            size((p)<-[:HEARTS]-(:User)) AS hearts,                
            p2{.content, .created_at, author:u2} AS rt
        RETURN p{._id, .content, .created_at, reposts:reposts, hearts:hearts, replies:replies, repost:rt}
    `, {
        uid: req.params.uid
    })
    
    let posts:any = result.records.map(record => {
        let x = record.get('p');
        x.hearts = x.hearts.toNumber();
        x.reposts = x.reposts.toNumber();
        x.replies = x.replies.toNumber();
        if(x.repost) {
            x.repost.author = filterUserFields(x.repost.author.properties, true);
        } else {
            delete x.repost;
        }
        return x;
    });
    res.json(posts);
}

export const readPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (p:Post {_id:$pid})
        WITH p,
            size((p)<-[:REPOST_OF]-(:Post)) AS reposts,
            size((p)<-[:HEARTS]-(:User)) AS hearts
        RETURN p{._id, .content, .created_at, reposts:reposts, hearts:hearts}
    `, {
        pid: req.params.pid,
    })

    if(!result.records.length) throw new ErrorHandler(HTTP.NotFound, "No such post")

    let post = result.records[0].get('p');
    post.hearts = post.hearts.toNumber();
    post.reposts = post.reposts.toNumber();
    res.json(post);
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

export const deletePost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (p:Post { _id:$pid })
        DELETE p
    `, {
        pid: req.params.pid
    })

    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not delete post")
    res.status(200).end();
}

export const heartPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (u:User { _id:$uid }), (p:Post { _id:$pid })
        MERGE (u)-[:HEARTS]->(p)
    `, {
        uid:req.params.uid,
        pid:req.params.pid
    })

    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not heart post")
    res.status(201).end();
}

export const unheartPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (:User { _id:$uid })-[r:HEARTS]->(:Post { _id:$pid })
        DELETE r
    `, {
        uid:req.params.uid,
        pid:req.params.pid
    })

    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not un-heart post")
    res.status(200).end();
}
