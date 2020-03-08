import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema } from "./Recordable.model"
import { IPlant } from "./Plant.model"

export interface IGarden extends IRecordable {
    plants: IPlant[],
}

export var GardenSchema:Schema = extendSchema(RecordableSchema, {
    plants: Array
})

export const Garden:Model<IGarden> = model<IGarden>("Garden", GardenSchema);
