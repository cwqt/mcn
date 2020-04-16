import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser, IUserModel } from './User.model';
import { IPostModel } from './Post.model';

export interface IComment {
    user_id:        IUserModel["_id"];
    post_id:        IPostModel["_id"];
    replies:        ICommentModel[],
    content:        string;
    likes_count:    number;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface ICommentModel extends IComment, Document {
    _id: string,
}

export var CommentSchema:Schema = new Schema({
    author_id:      Schema.Types.ObjectId,
    replies:        [{type: Schema.Types.ObjectId, ref:"Comment"}],
    content:        String,
    likes_count:    Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Comment:Model<ICommentModel> = model<ICommentModel>("Comment", CommentSchema);
