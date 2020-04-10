import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IUserModel } from "./User.model";
import { IPlantModel } from './Plant.model';
import { IGardenModel } from './Garden.model';
import { IApiKeyModel } from './ApiKey.model';

export enum IHardwareModels {
    mcnWemosD1Mini,
}

export interface IDevice {
    user_id:            IUserModel["_id"];
    friendly_title:     string;
    hardware_model:     string;
    software_version:   string;
    recordable_id:      IPlantModel["_id"] | IGardenModel["_id"];
    api_key_id:         IApiKeyModel["_id"];
    verified:           string;
    created_at?:        Date;
    updated_at?:        Date;
}

export interface IDeviceModel extends IDevice, Document {}

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

export const Device:Model<IDeviceModel> = model<IDeviceModel>("Device", DeviceSchema);