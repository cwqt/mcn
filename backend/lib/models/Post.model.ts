import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUser } from './User.model';

export interface IPost extends Document {
    content:        string,
    images?:        string[],
    belongs_to:     IUser,
    created_at?:    Date,
    modified_at?:   Date,
}

export var PostSchema:Schema = new Schema({
    content: String,
    images: [String],
    belongs_to: Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Post:Model<IPost> = model<IPost>("Post", PostSchema);
