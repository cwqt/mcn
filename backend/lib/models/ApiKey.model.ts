import { Document, Schema, Model, model} from "mongoose";
import { IUserModel } from './User.model';
import { IDeviceModel } from './Device';

export interface IApiKey {
    user_id:        IUserModel["_id"];
    device_id:      IDeviceModel["_id"];
    key:            string;
    type:           'plant' | 'garden';
    created_at?:    Date;
    updated_at?:    Date;
}

export interface IApiKeyModel extends IApiKey, Document {}

export var ApiKeySchema:Schema = new Schema({
    user_id:    Schema.Types.ObjectId,
    device_id:  Schema.Types.ObjectId,
    key:        String,
    type:       String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const ApiKey:Model<IApiKeyModel> = model<IApiKeyModel>("ApiKey", ApiKeySchema);
