import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema } from "./Recordable.model"

export interface IPlant extends IRecordable {
    type: 'plant'
}

export var PlantSchema:Schema = new extendSchema(RecordableSchema, {
    type: String
})

export const Plant:Model<IPlant> = model<IPlant>("Plant", PlantSchema);
