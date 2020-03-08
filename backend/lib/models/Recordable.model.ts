import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import User from "./User.model"

export interface IRecordable extends Document {
    name:       string,
    belongs_to: User,
    image?:     string,
    created_at: Date,
    modified_at:Date,
    feed_url?:  string,
    host_url?:  string,
    recording:  string[],
    parameters: Array<number[]>,
    events:     string[]
}

export var RecordableSchema:Schema = new Schema({
    name:           String,
    belongs_to:     mongoose.Types.ObjectId(),
    image:          String,
    created_at:     Number,
    modified_at:    Number,
    feed_url:       String,
    host_url:       String,
    recording:      Array,
    parameters:     Object,
    events:         Array
}).pre<IRecordable>('save', function (next) {
    if (this.isNew) {
      this.created_at = new Date();
    } else {
      this.modified_at = new Date();
    }
    next();
  });

export const Recordable:Model<IRecordable> = model<IRecordable>("Recordable", RecordableSchema);
