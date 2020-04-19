import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser, IUserModel } from './User.model';
import { IPostModel } from './Post.model';

// const mongo4j = require('mongo4j');

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

export const Comment = {
    _id: {
        primary: true,
        type: 'uuid',
        required: true,
    },
    content: { type: 'string', required: true },
    created_at: { type: 'isoDate', default: () => new Date().toISOString() },
    
    comments_on: {
        type: 'relationship',
        target: 'Post',
        relationship: 'COMMENTS_ON',
        direction: 'out',
    },
    replies_to: {
        type: 'relationship',
        target: 'Comment',
        relationship: 'REPLIES_TO',
        direction: 'out',
    },
    created_by: {
        type: 'relationship',
        target: 'User',
        relationship: 'CREATED_BY',
        direction: 'out',
    }
}

// export var CommentSchema:Schema = new Schema({
//     user_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     post_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'Post',
//     },
//     parent_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'Comment',
//     },
//     content:      String,
//     likes_count:  Number,
// }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

// // CommentSchema.plugin(mongo4j.plugin());

// export const Comment:Model<ICommentModel> = model<ICommentModel>("Comment", CommentSchema);
