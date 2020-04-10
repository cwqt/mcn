import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUserModel, IUser } from './User.model';

export interface IPost {
    content:        string,
    likes_count:    number,
    user_id:        IUserModel["_id"],
    images?:        string[],
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IPostModel extends IPost, Document {}

export var PostSchema:Schema = new Schema({
    content:        String,
    images:         [String],
    user_id:        Schema.Types.ObjectId,
    likes_count:    Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Post:Model<IPostModel> = model<IPostModel>("Post", PostSchema);
