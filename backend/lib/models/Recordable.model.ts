import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IUser } from "./User.model"

interface IParameter {
  upper:  number,
  avg:    number,
  lower:  number, 
}

export enum RecordableTypes {
  Garden,
  Plant
}

export interface IRecordable extends Document {
    name:       string,
    user_id:    string,
    recording:  string[],
    image?:     string,
    feed_url?:  string,
    host_url?:  string,
    verified:       boolean,
    parameters?:    Map<string, IParameter[]>,
    created_at?:    Date,
    updated_at?:   Date,
}

export var RecordableSchema:Schema = new Schema({
    name:           String,
    user_id:        Schema.Types.ObjectId,
    image:          String,
    feed_url:       String,
    host_url:       String,
    verified:       Boolean,
    recording:      {
      type: Map,
      of: Object
    },
    parameters:     Object,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Recordable:Model<IRecordable> = model<IRecordable>("Recordable", RecordableSchema);
