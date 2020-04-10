import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IRecordable, IRecordableModel } from '../models/Recordable.model';

export interface IEvent {
    recordable_id:  IRecordableModel["_id"],
    timestamp:      Date,
    event_type:     string,
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IEventModel extends IEvent, Document {}

export var EventSchema:Schema = new Schema({
    recordable_id:  mongoose.Types.ObjectId(),
    timestamp:      Date,
    event_type:     String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Event:Model<IEventModel> = model<IEventModel>("Event", EventSchema);