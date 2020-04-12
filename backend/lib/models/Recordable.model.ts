import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IUserModel } from "./User.model"

export enum RecordableTypes {
  Garden = 'garden',
  Plant = 'plant'
}

interface IParameter {
  upper:  number,
  avg:    number,
  lower:  number, 
}

export interface IRecordable {
    name:           string,
    user_id:        IUserModel["_id"],
    recording?:     string[],
    image?:         string,
    feed_url?:      string,
    host_url?:      string,
    verified:       boolean,
    parameters?:    Map<string, IParameter[]>,
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IRecordableModel extends IRecordable, Document {
  _id: string,
}

export var RecordableSchema:Schema = new Schema({
    name:           String,
    user_id:        Schema.Types.ObjectId,
    image:          String,
    feed_url:       String,
    host_url:       String,
    verified:       Boolean,
    parmeterd:      {
      type: Map,
      of: Object
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Recordable:Model<IRecordableModel> = model<IRecordableModel>("Recordable", RecordableSchema);
