import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

export enum IHardwareModels {
    mcnWemosD1Mini,
}

export interface IDevice extends Document {
    user_id:            string;
    friendly_title:     string;
    hardware_model:     string;
    software_version:   string;
    recordable_id:      string;
    api_key_id:         string;
    verified:           string;
    created_at?:        Date;
    updated_at?:        Date;
}

export var DeviceSchema:Schema = new Schema({
    user_id:            Schema.Types.ObjectId,
    friendly_title:     String,
    hardware_model: {
        type:Number,
        enum: IHardwareModels
    },
    software_version:   String,
    recordable_id:      Schema.Types.ObjectId,
    api_key_id:         Schema.Types.ObjectId,
    verified:           Boolean,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Device:Model<IDevice> = model<IDevice>("Device", DeviceSchema);