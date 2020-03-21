import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IRecordable } from '../models/Recordable.model';

export interface IEvent extends Document {
    belongs_to: IRecordable,
    timestamp: number,
    event_type: string,
    created_at?:    Date,
    modified_at?:   Date,
}

export var EventSchema:Schema = new Schema({
    belongs_to: mongoose.Types.ObjectId(),
    timestamp:  Number,
    event_type: String
})

export const Event:Model<IEvent> = model<IEvent>("Event", EventSchema);