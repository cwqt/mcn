import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IUserModel }       from './User.model';
import { IPostModel }       from './Post.model';
import { IRecordableModel } from './Recordable.model';
import { ICommentModel }    from './Comment.model';
import { IDeviceModel }     from './Device.model';

export enum ContentTypes {
    Recordable  = "recordable",
    Post        = "post",
    Comment     = "comment",
    Device      = "device"
}

export interface IHeart {
    user_id:        IUserModel["_id"];
    content_id:     IPostModel["_id"] | ICommentModel["_id"] | IRecordableModel["_id"] | IDeviceModel["_id"];
    content_type:   ContentTypes
    created_at?:    Date;
    updated_at?:    Date;
}

export interface IHeartModel extends IHeart, Document {
    _id: string,
}

export var HeartSchema:Schema = new Schema({
    user_id:    Schema.Types.ObjectId,
    content_id: Schema.Types.ObjectId,
    content_type: {
        type: Schema.Types.ObjectId,
        enum: ContentTypes
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Heart:Model<IHeartModel> = model<IHeartModel>("Heart", HeartSchema);
