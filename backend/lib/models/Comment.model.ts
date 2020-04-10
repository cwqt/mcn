import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser, IUserModel } from './User.model';
import { IPostModel } from './Post.model';

export interface IComment {
    user_id:        IUserModel["_id"];
    post_id:        IPostModel["_id"];
    parent_id?:     ICommentModel["_id"];
    content:        string;
    likes_count:    number;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface ICommentModel extends IComment, Document {}

export var CommentSchema:Schema = new Schema({
    user_id:        Schema.Types.ObjectId,
    post_id:        Schema.Types.ObjectId,
    parent_id:      Schema.Types.ObjectId,
    content:        String,
    likes_count:    Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Comment:Model<ICommentModel> = model<ICommentModel>("Comment", CommentSchema);
