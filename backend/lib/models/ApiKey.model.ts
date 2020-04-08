import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
import { IRecordable } from './Recordable.model';
import { IUser } from './User.model';
import { IPlant } from './Plant.model';
import { IGarden } from './Garden.model';

export interface IApiKey extends Document {
    user_id:        string;
    device_id:      string;
    key:            string;
    type:           'plant' | 'garden';
    created_at?:    Date;
    updated_at?:   Date;
}

export var ApiKeySchema:Schema = new Schema({
    user_id:    Schema.Types.ObjectId,
    device_id:  Schema.Types.ObjectId,
    key:        String,
    type:       String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const ApiKey:Model<IApiKey> = model<IApiKey>("ApiKey", ApiKeySchema);
