import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";
let extendSchema = require('mongoose-extend-schema')//no @types

import { IRecordable, RecordableSchema, RecordableTypes } from "./Recordable.model"
import { IPlantModel } from "./Plant.model"

export interface IGarden extends IRecordable {
    plants:         Array<IPlantModel["_id"]>;
    type:           RecordableTypes.Garden;
    created_at?:    Date;
    updated_at?:    Date;
}

export interface IGardenModel extends IGarden, Document {}

export var GardenSchema:Schema = extendSchema(RecordableSchema, {
    plants: [mongoose.Schema.Types.ObjectId],
    type: {
        type: String,
        enum: [RecordableTypes.Garden]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const Garden:Model<IGardenModel> = model<IGardenModel>("Garden", GardenSchema);
