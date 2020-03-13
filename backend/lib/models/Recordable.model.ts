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
    belongs_to: IUser,
    image?:     string,
    created_at: Date,
    modified_at:Date,
    feed_url?:  string,
    host_url?:  string,
    recording:  string[],
    parameters: IParameter[],
}

export var RecordableSchema:Schema = new Schema({
    name:           String,
    belongs_to:     mongoose.Types.ObjectId(),
    image:          String,
    created_at:     Date,
    modified_at:    Date,
    feed_url:       String,
    host_url:       String,
    recording:      [String],
    parameters:     Object,
}).pre<IRecordable>('save', function (next) {
    if (this.isNew) {
      this.created_at = new Date();
    } else {
      this.modified_at = new Date();
    }
    next();
  });

export const Recordable:Model<IRecordable> = model<IRecordable>("Recordable", RecordableSchema);
