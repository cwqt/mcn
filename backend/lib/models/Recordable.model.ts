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
    recording:  string[],
    image?:     string,
    feed_url?:  string,
    host_url?:  string,
    parameters?: IParameter[],
    created_at?:    Date,
    modified_at?:   Date,
}

export var RecordableSchema:Schema = new Schema({
    name:           String,
    belongs_to:     Schema.Types.ObjectId,
    created_at:     Date,
    modified_at:    Date,
    image:          String,
    feed_url:       String,
    host_url:       String,
    recording:      [String],
    parameters:     Object,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Recordable:Model<IRecordable> = model<IRecordable>("Recordable", RecordableSchema);
