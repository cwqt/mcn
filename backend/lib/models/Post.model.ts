import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser } from './User.model';

export interface IPost extends Document {
    content:        string,
    likes_count:    number,
    user_id:        string,
    images?:        string[],
    created_at?:    Date,
    updated_at?:   Date,
}

export var PostSchema:Schema = new Schema({
    content:        String,
    images:         [String],
    user_id:        Schema.Types.ObjectId,
    likes_count:    Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Post:Model<IPost> = model<IPost>("Post", PostSchema);
