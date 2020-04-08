import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema } from "./Recordable.model"

export interface IPlant extends IRecordable {
    type:           'plant',
    species:        string,
    garden_id?:     string,
    created_at?:    Date,
    updated_at?:    Date
}

export var PlantSchema:Schema = new extendSchema(RecordableSchema, {
    type:       'plant',
    species:    String,
    garden_id:  Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Plant:Model<IPlant> = model<IPlant>("Plant", PlantSchema);
