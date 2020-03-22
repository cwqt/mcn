import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser } from './User.model';
import { IPost } from './Post.model';

export interface IComment extends Document {
    content:        string,
    belongs_to:     IUser,
    likes_count:    number,
    post_id:        IPost,
    parent_id?:     string,
    created_at?:    Date,
    modified_at?:   Date,
}

export var CommentSchema:Schema = new Schema({
    likes_count: Number,
    content: String,
    belongs_to: Schema.Types.ObjectId,
    post_id:    Schema.Types.ObjectId,
    parent_id: Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Comment:Model<IComment> = model<IComment>("Comment", CommentSchema);
