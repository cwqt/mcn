import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema, RecordableTypes } from "./Recordable.model"
import { IGardenModel } from "./Garden.model";

export interface IPlant extends IRecordable {
    type:           RecordableTypes.Plant,
    species:        string,
    garden_id?:     IGardenModel["_id"],
    created_at?:    Date,
    updated_at?:    Date
}

export interface IPlantModel extends IPlant, Document {
    _id: string,
}

export var PlantSchema:Schema = new extendSchema(RecordableSchema, {
    type: {
        type: String,
        enum: [RecordableTypes.Plant]
    },
    species:    String,
    garden_id:  Schema.Types.ObjectId,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Plant:Model<IPlantModel> = model<IPlantModel>("Plant", PlantSchema);
