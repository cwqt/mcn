import { Request, Response }    from "express"
import { Types }                from 'mongoose'

import { ErrorHandler }     from "../common/errorHandler";
import { HTTP }             from "../common/http";
import { IPost, IPostStub } from '../models/Post.model';
import { n4j }              from '../common/neo4j';
import { filterUserFields } from './User.controller'

const makePost = (content:string | null, repost?:any):IPostStub => {
    let post:IPostStub = {
        _id:           Types.ObjectId().toHexString(),
        content:       content,
        created_at:    Date.now(),
    }
    if(repost) post["repost"] = repost;
    return post;
}

export const createPost = async (req:Request, res:Response) => {
    let post = makePost(req.body.content);

    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})
            CREATE (p:Post $body)<-[:POSTED]-(u)
            RETURN p
        `, {
            uid: req.params.uid,
            body: post
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    res.status(201).json(result.records[0].get('p').properties);
}

export const readAllPosts = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    console.log(req.session)

    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})-[:POSTED]->(p:Post)
            OPTIONAL MATCH (p)-[:REPOST_OF]->(p2:Post)<-[:POSTED]-(u2:User)
            OPTIONAL MATCH (:User {_id:$selfid})-[isHearting:HEARTS]->(p)
            OPTIONAL MATCH (:User {_id:$selfid})-[:POSTED]->(:Post)-[hasReposted:REPOST_OF]->(p)
            WITH p, p2, u2, isHearting, hasReposted,
                size((p)<-[:REPOST_OF]-(:Post)) AS reposts,
                size((p)<-[:REPLY_TO]-(:Post)) AS replies,
                size((p)<-[:HEARTS]-(:User)) AS hearts,                
                p2{.content, .created_at, author:u2} AS rt
            RETURN p{._id, .content, .created_at, reposts:reposts, hearts:hearts, replies:replies, repost:rt}, isHearting, hasReposted
        `, {
            uid: req.params.uid,
            selfid: req.session.user.id
        })        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)        
    } finally {
        session.close();
    }

    let posts:IPost[] = result.records.map((record:any) => {
        let x = record.get('p');
        x.isHearting = record.get('isHearting') ? true : false;
        x.hasReposted = record.get('hasReposted') ? true : false;
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

export const readPost = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (p:Post {_id:$pid})
            WITH p,
                size((p)<-[:REPOST_OF]-(:Post)) AS reposts,
                size((p)<-[:HEARTS]-(:User)) AS hearts
            RETURN p{._id, .content, .created_at, reposts:reposts, hearts:hearts}
        `, {
            pid: req.params.pid,
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)        
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.NotFound, "No such post")

    let post = result.records[0].get('p');
    post.hearts = post.hearts.toNumber();
    post.reposts = post.reposts.toNumber();
    res.json(post);
}

export const repostPost = async (req:Request, res:Response) => {
    // /users/:uid/posts/:pid/repost -- user uid is reposting post with pid
    // todo: disable ability to repost a repost w/ no content
    let session = n4j.session();
    let result;
    try {
        let post = makePost(req.body.content || '');
    
        result = await session.run(`
            MATCH (p:Post {_id:$pid}), (u:User {_id:$uid})
            CREATE (u)-[:POSTED]->(r:Post $body)-[:REPOST_OF]->(p)
            RETURN r
        `, {
            pid: req.params.pid,
            uid: req.params.uid,
            body: post
        })        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)        
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create repost")
    res.status(201).json(result.records[0].get('r').properties);
}

export const replyToPost = async (req:Request, res:Response) => {
    //todo: disable ability to reply to a 'repost with no reply'
    let session = n4j.session();
    let result;
    try {
        let post = makePost(req.body.content);
        result = await session.run(`
            MATCH (p:Post {_id:$pid}), (u:User {_id:$uid})
            CREATE (u)-[:POSTED]->(r:Post $body)-[:REPLY_TO]->(p)
            RETURN r
        `, {
            pid: req.params.pid,
            uid: req.params.uid,
            body: post
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create reply")
    res.status(201).json(result.records[0].get('r').properties);
}

export const updatePost = (req:Request, res:Response) => {
}

export const deletePost = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (p:Post { _id:$pid })
            DELETE p
        `, {
            pid: req.params.pid
        })        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close()
    }

    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not delete post")
    res.status(200).end();
}

export const heartPost = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User { _id:$uid }), (p:Post { _id:$pid })
            MERGE (u)-[:HEARTS]->(p)
        `, {
            uid:req.params.uid,
            pid:req.params.pid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close()
    }

    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not heart post")
    res.status(201).end();
}

export const unheartPost = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (:User { _id:$uid })-[r:HEARTS]->(:Post { _id:$pid })
            DELETE r
        `, {
            uid:req.params.uid,
            pid:req.params.pid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close()
    }
    
    if(!result.summary.counters.containsUpdates()) throw new ErrorHandler(HTTP.ServerError, "Could not un-heart post")
    res.status(200).end();
}
