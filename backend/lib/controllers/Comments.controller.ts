import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Comment, ICommentModel }   from '../models/Comment.model';
import { Post } from "../models/Post.model";

export const createComment = (req:Request, res:Response, next:NextFunction) => {
    let data:{[index:string]:any} = {
        content: req.body.content
    }
    if(res.locals.isReply) data["replies"] = [];

    let comment = new Comment(data);

    if(!res.locals.isReply) {
        //commenting on a post
        comment.save()
            .then(comment => Post.findById(req.params.pid))
            .then(post => {
                post.comments.unshift(comment);
                post.save();
            })
            .catch(error => next(new ErrorHandler(HTTP.ServerError, error)));
    } else {
        //replying to a comment
        comment.save()
            .then(comment => Comment.findById(req.params.cid))
            .then(parent => {
                parent.replies.unshift(comment);
                parent.save();
            })
            .catch(error => next(new ErrorHandler(HTTP.ServerError, error)));
    }

    res.json(comment);
}

export const updateComment = (req:Request, res:Response, next:NextFunction) => {
    Comment.findByIdAndUpdate(req.params.cid, {
        content: req.body.content
    }, {new:true}, (error:any, comment:ICommentModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(comment);
    })
}

export const deleteComment = (req:Request, res:Response, next:NextFunction) => {
    Comment.findByIdAndDelete(req.params.cid, (error:any) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(HTTP.OK);
    })
}
