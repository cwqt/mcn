import { Request, Response, NextFunction }    from "express"

import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { Post, IPostModel }         from '../models/Post.model';


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

export const readPost = (req:Request, res:Response, next:NextFunction) => {
    Post.findOne({_id: req.params.pid})
        .populate('comments')
        .exec((error:any, post:IPostModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(post);
    })
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
