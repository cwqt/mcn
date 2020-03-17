import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IRecordable } from './Recordable.model';

export interface IMeasurement {
    [type:string]: number
}

export interface IMeasurements extends Document {
    belongs_to: IRecordable,
    timestamp: number,
    measurements: IMeasurement[]
}

export var MeasurementSchema:Schema = new Schema({
    belongs_to: Schema.Types.ObjectId,
    event_type: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Measurement:Model<IMeasurements> = model<IMeasurements>("Measurement", MeasurementSchema);
