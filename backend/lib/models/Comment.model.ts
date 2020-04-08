import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser } from './User.model';
import { IPost } from './Post.model';

export interface IComment extends Document {
    user_id:        string;
    post_id:        IPost;
    parent_id?:     string;
    content:        string;
    likes_count:    number;
    created_at?:    Date;
    updated_at?:    Date;
}

export var CommentSchema:Schema = new Schema({
    user_id:        Schema.Types.ObjectId,
    post_id:        Schema.Types.ObjectId,
    parent_id:      Schema.Types.ObjectId,
    content:        String,
    likes_count:    Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Comment:Model<IComment> = model<IComment>("Comment", CommentSchema);
