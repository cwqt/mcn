import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUserModel, IUser } from './User.model';
import { ICommentModel } from './Comment.model';
import { Types } from "mongoose";

export interface IPost {
    content:        string,
    user_id:        IUserModel["_id"],
    likes_count:    number,
    images?:        string[],
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IPostModel extends IPost, Document {
    _id: string,
    comments: ICommentModel[]
}

export const Post = {
    _id: {
        primary: true,
        type: 'uuid',
        required: true,
        default: () => new Types.ObjectId(),
    },
    content: { type: 'string', required: true },
    created_at: { type: 'isoDate', default: () => new Date().toISOString() },
    created_by: {
        type: 'relationship',
        target: 'User',
        relationship: 'CREATED_BY',
        direction: 'out',
    }
}


// export var PostSchema:Schema = new Schema({
//     content:        String,
//     user_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     images:         [String],
//     likes_count:    {type: Number, default: 0},
// }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

// PostSchema.plugin(mongo4j.plugin());

// export const Post:Model<IPostModel> = model<IPostModel>("Post", PostSchema);
