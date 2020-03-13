import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IRecordable } from '../models/Recordable.model';

export interface IMeasurement {
    [type:string]: number
}

export interface IMeasurements extends Document {
    belongs_to: IRecordable,
    timestamp: number,
    measurements: IMeasurement[]
}

export var MeasurementSchema:Schema = new Schema({
    belongs_to: mongoose.Types.ObjectId(),
    timestamp:  Number,
    event_type: String
})

export const Meaurements:Model<IMeasurements> = model<IMeasurements>("Measurement", MeasurementSchema);
