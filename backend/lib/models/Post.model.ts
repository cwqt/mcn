import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUserModel, IUser } from './User.model';
import { ICommentModel } from './Comment.model';

export interface IPost {
    content:        string,
    user_id:        IUserModel["_id"],
    comments:       ICommentModel[],
    likes_count:    number,
    images?:        string[],
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IPostModel extends IPost, Document {
    _id: string,
}

export var PostSchema:Schema = new Schema({
    content:        String,
    user_id:        Schema.Types.ObjectId,
    comments:       [{type: Schema.Types.ObjectId, ref: "Comment"}],
    images:         [String],
    likes_count:    {type: Number, default: 0},
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Post:Model<IPostModel> = model<IPostModel>("Post", PostSchema);
