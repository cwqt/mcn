import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IRecordable, IRecordableModel } from './Recordable.model';

export interface IDataPoint {
    [type:string]: number
}

export interface IMeasurement {
    recordable_id:  IRecordableModel["_id"],
    timestamp:      Date,
    measurements:   IDataPoint[],
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IMeasurementModel extends IMeasurement, Document {
    _id: string,
}

export var MeasurementSchema:Schema = new Schema({
    recordable_id:  Schema.Types.ObjectId,
    timestamp:      Date
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Measurement:Model<IMeasurementModel> = model<IMeasurementModel>("Measurement", MeasurementSchema);
