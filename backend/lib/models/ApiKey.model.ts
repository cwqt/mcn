import { Document, Schema, Model, model} from "mongoose";
import { IUserModel } from './User.model';
import { IDeviceModel } from './Device.model';
import { RecordableTypes } from "./Recordable.model";

export interface IApiKey {
    user_id:        IUserModel["_id"];
    device_id:      IDeviceModel["_id"];
    key:            string;
    type:           RecordableTypes;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface IApiKeyModel extends IApiKey, Document {
    _id: string,
}

export var ApiKeySchema:Schema = new Schema({
    user_id:    Schema.Types.ObjectId,
    device_id:  Schema.Types.ObjectId,
    key:        String,
    type:       {
        type: String,
        enum: Object.values(RecordableTypes)
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const ApiKey:Model<IApiKeyModel> = model<IApiKeyModel>("ApiKey", ApiKeySchema);
