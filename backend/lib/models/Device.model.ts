import { Document, Schema, Model, model} from "mongoose";
import { IUserModel } from "./User.model";
import { IPlantModel } from './Plant.model';
import { IGardenModel } from './Garden.model';
import { IApiKeyModel } from './ApiKey.model';
import { ACCEPTED_MEASUREMENTS } from '../common/ACCEPTED_MEASUREMENTS';

export enum IHardwareModels {
    mcnWemosD1Mini = "Wemos D1 Mini",
}

export interface IDevice {
    verified:           boolean;
    name:               string;
    hardware_model?:    string;
    software_version?:  string;
    device_ip?:         string;
    created_at?:        Date;
    updated_at?:        Date;
    recording?:         Array<ACCEPTED_MEASUREMENTS>;
}

export interface IDeviceModel extends IDevice, Document {
    _id: string,
}

export var DeviceSchema:Schema = new Schema({
    user_id:            Schema.Types.ObjectId,
    recordable_id:      Schema.Types.ObjectId,
    api_key_id:         Schema.Types.ObjectId,
    friendly_name:      String,
    device_ip:          String,
    hardware_model: {
        type: String,
        enum: Object.values(IHardwareModels)
    },
    recording: [{type:String, enum:Object.values(ACCEPTED_MEASUREMENTS)}],
    software_version:   String,
    verified:           { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Device:Model<IDeviceModel> = model<IDeviceModel>("Device", DeviceSchema);