import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IRecordable } from './Recordable.model';

export interface IMeasurement {
    [type:string]: number
}

export interface IMeasurements extends Document {
    recordable_id:  string,
    timestamp:      Date,
    measurements:   IMeasurement[],
    created_at?:    Date,
    updated_at?:    Date,
}

export var MeasurementSchema:Schema = new Schema({
    recordable_id:  Schema.Types.ObjectId,
    timestamp:      Date
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Measurement:Model<IMeasurements> = model<IMeasurements>("Measurement", MeasurementSchema);
