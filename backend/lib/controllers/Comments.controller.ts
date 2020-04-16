import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Comment, ICommentModel }   from '../models/Comment.model';
import { Post } from "../models/Post.model";

export const createComment = (req:Request, res:Response, next:NextFunction) => {
    let data:{[index:string]:any} = {
        content: req.body.content,
        user_id: req.params.uid
    }
    if(res.locals.isReply) {
        data["parent_id"] = req.params.cid;
    } else {
        data["post_id"] = req.params.pid;
    }

    Comment.create(data, (error:any, comment:ICommentModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(comment);
    })
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
