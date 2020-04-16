import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser, IUserModel } from './User.model';
import { IPostModel } from './Post.model';

const mongo4j = require('mongo4j');

export interface IComment {
    user_id:        IUserModel["_id"];
    post_id?:       IPostModel["_id"];
    parent_id?:     ICommentModel["_id"];
    content:        string;
    likes_count:    number;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface ICommentModel extends IComment, Document {
    _id: string,
}

export var CommentSchema:Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        neo_rel_name: "Created By"
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        neo_rel_name: "Comments On"
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        neo_rel_name: "Replies To"
    },
    content:      String,
    likes_count:  Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

CommentSchema.plugin(mongo4j.plugin());

export const Comment:Model<ICommentModel> = model<ICommentModel>("Comment", CommentSchema);
