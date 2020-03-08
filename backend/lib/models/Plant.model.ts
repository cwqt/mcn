import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema } from "./Recordable.model"

export interface IPlant extends IRecordable {}

export var PlantSchema:Schema = new extendSchema(RecordableSchema, {})

export const Plant:Model<IPlant> = model<IPlant>("Garden", PlantSchema);
