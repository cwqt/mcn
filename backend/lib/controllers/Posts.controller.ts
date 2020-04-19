import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Post, IPostModel }         from '../models/Post.model';

import { Comment, ICommentModel } from '../models/Comment.model';

import n4j from '../common/neo4j';

export const createPost = (req:Request, res:Response, next:NextFunction) => {
    Post.create({
        user_id: req.params.uid,
        content: req.body.content
    }, (error:any, post:IPostModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(post);
    })
}

export const readAllPosts = (req:Request, res:Response, next:NextFunction) => {
    Post.find({user_id:req.params.uid}, (error:any, posts:IPostModel[]) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(posts);
    })
}

export const readPost = async (req:Request, res:Response, next:NextFunction) => {
    // let post:IPostModel = await (await Post.findOne({_id: req.params.pid})).toObject();
    // if(!post) throw new ErrorHandler(HTTP.NotFound, "no such post");

    // let session = n4j.driver.session()
    // // let result = await session.run(`MATCH (c:Comment)-[:COMMENTS_ON]->(u:Post {m_id: '${post._id}'}) RETURN c`)
    // let result = await session.run(`
    //     MATCH (post:Post {m_id: '${post._id}'})
    //     OPTIONAL MATCH (commenters:User)<-[:CREATED_BY]-(comment:Comment)-[:COMMENTS_ON]->(post)
    //     OPTIONAL MATCH (repliers:User)<-[:CREATED_BY]-(reply:Comment)-[:REPLIES_TO]->(comment)
    //     WITH post, comment, Collect(reply) as replies
    //     WITH post, Collect({comment: comment, replies: replies}) as comments
    //     RETURN Collect({post:post, comments:comments}) as posts
    // `)
    // session.close();

    // let nodes = result.records.map((node:any) => {
    //     console.log(node);
    //     // node.get('posts').properties.m_id
    // });
    // let query = Comment.find({_id: { $in: nodes}}).select('-user_id -post_id')

    // let comments = await query.exec();    
    // post.comments = comments;

    // res.json(post)
}

export const updatePost = (req:Request, res:Response, next:NextFunction) => {
    Post.findByIdAndUpdate(req.params.pid, {
        content: req.body.content
    }, {new:true}, (error:any, post:IPostModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(post);
    })
}

export const deletePost = (req:Request, res:Response, next:NextFunction) => {
    Post.findByIdAndDelete(req.params.pid, (error:any) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(HTTP.OK);
    })
}
