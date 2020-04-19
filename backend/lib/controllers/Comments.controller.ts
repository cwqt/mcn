import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Comment, ICommentModel }   from '../models/Comment.model';
import { Post } from "../models/Post.model";

import neode from '../common/neo4j';

export const createComment = async (req:Request, res:Response, next:NextFunction) => {
    let data:{[index:string]:any} = {
        content: req.body.content,
    }

    let user = await neode.instance.find('User', req.params.uid);
    let result;

    if(res.locals.isReply) {
        let comment = await neode.instance.find('Comment', req.params.cid);
        let reply = await neode.instance.create('Comment', data);
        await reply.relateTo(comment, 'replies_to');
        result = reply;
    } else {
        let post = await neode.instance.find('Post', req.params.pid);
        let comment = await neode.instance.create('Comment', data);
        await comment.relateTo(post, 'comments_on');
        result = comment;
    }
    await result.relateTo(user, 'created_by');
    res.json(result.properties());
}

// export const updateComment = (req:Request, res:Response, next:NextFunction) => {
//     Comment.findByIdAndUpdate(req.params.cid, {
//         content: req.body.content
//     }, {new:true}, (error:any, comment:ICommentModel) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         res.json(comment);
//     })
// }

// export const deleteComment = (req:Request, res:Response, next:NextFunction) => {
//     Comment.findByIdAndDelete(req.params.cid, (error:any) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         res.json(HTTP.OK);
//     })
// }
