import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Post, IPostModel }         from '../models/Post.model';

import { Comment, ICommentModel } from '../models/Comment.model';

import neode from '../common/neo4j';

export const createPost = async (req:Request, res:Response, next:NextFunction) => {
    let content = {
        content: req.body.content
    }

    try {
        let post = await neode.instance.create('Post', content)
        let user = await neode.instance.find('User', req.params.uid);
        post.relateTo(user, 'created_by');
        res.json(post.properties());
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const readAllPosts = async (req:Request, res:Response, next:NextFunction) => {
    const order_by = (req.query.order || 'title') as string;
    const sort = (req.query.sort || 'ASC') as string;
    const limit = (req.query.limit || 10) as number;
    const page = (req.query.page || 1) as number;
    const skip = (page-1) * limit;

    let result = await neode.instance.cypher(`
        MATCH (post:Post)-[:CREATED_BY]->(:User {_id:$_id})
        RETURN post
    `, {
        _id: req.params.uid
    })
    
    let posts:any = result.records.map(record => record.get('post').properties);
    res.json(posts);
}

export const readPost = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (post:Post {_id:$pid})-[:CREATED_BY]->(:User {_id:$uid})
        OPTIONAL MATCH (commenters:User)<-[:CREATED_BY]-(comment:Comment)-[:COMMENTS_ON]->(post)
        OPTIONAL MATCH (repliers:User)<-[:CREATED_BY]-(reply:Comment)-[:REPLIES_TO]->(comment)
        WITH post, comment, commenters, COLLECT(reply{.content, name:repliers.name, username:repliers.username, .created_at}) as replies
        WITH post, comment{.content, .created_at, name:commenters.name, username:commenters.username, replies:coalesce(replies)} as comments
        RETURN post{.content, .created_at, comments:COLLECT(comments)} as p
    `, {
        pid: req.params.pid,
        uid: req.params.uid
    })

    if(!result.records.length) throw new ErrorHandler(HTTP.NotFound, "No such post")
    res.json(result.records[0].get('p'));
}

export const updatePost = (req:Request, res:Response, next:NextFunction) => {
    // Post.findByIdAndUpdate(req.params.pid, {
    //     content: req.body.content
    // }, {new:true}, (error:any, post:IPostModel) => {
    //     if(error) return next(new ErrorHandler(HTTP.ServerError, error));
    //     res.json(post);
    // })
}

export const deletePost = (req:Request, res:Response, next:NextFunction) => {
    // Post.findByIdAndDelete(req.params.pid, (error:any) => {
    //     if(error) return next(new ErrorHandler(HTTP.ServerError, error));
    //     res.json(HTTP.OK);
    // })
}
