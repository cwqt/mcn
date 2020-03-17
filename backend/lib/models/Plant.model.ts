import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema } from "./Recordable.model"

export interface IPlant extends IRecordable {
    type: 'plant',
    species: string,
    in_garden?: string,
}

export var PlantSchema:Schema = new extendSchema(RecordableSchema, {
    type: String,
    species: String,
    in_garden: Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Plant:Model<IPlant> = model<IPlant>("Plant", PlantSchema);
