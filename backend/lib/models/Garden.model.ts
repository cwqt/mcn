import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema, RecordableTypes } from "./Recordable.model"
import { IPlantModel } from "./Plant.model"

export interface IGarden extends IRecordable {
    type:           RecordableTypes.Garden;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface IGardenModel extends IGarden, Document {
    _id: string,
}

export var GardenSchema:Schema = extendSchema(RecordableSchema, {
    type: {
        type: String,
        default: RecordableTypes.Garden,
        enum: [RecordableTypes.Garden]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Garden:Model<IGardenModel> = model<IGardenModel>("Garden", GardenSchema);
