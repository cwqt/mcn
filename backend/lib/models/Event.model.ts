import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IRecordable } from '../models/Recordable.model';

export interface IEvent extends Document {
    recordable_id:  string,
    timestamp:      Date,
    event_type:     string,
    created_at?:    Date,
    updated_at?:   Date,
}

export var EventSchema:Schema = new Schema({
    recordable_id:  mongoose.Types.ObjectId(),
    timestamp:      Date,
    event_type:     String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Event:Model<IEvent> = model<IEvent>("Event", EventSchema);