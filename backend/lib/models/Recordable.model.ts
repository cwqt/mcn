import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

import { IUserModel } from "./User.model"

export enum RecordableTypes {
  Garden = 'garden',
  Plant = 'plant'
}

interface IParameter {
  upper:  number,
  avg:    number,
  lower:  number, 
}

export interface IRecordable {
    name:           string,
    recording?:     string[],
    image?:         string,
    feed_url?:      string,
    verified:       boolean,
    parameters?:    Map<string, IParameter[]>,
    created_at?:    Date,
    updated_at?:    Date,
    test:string,
}

export interface IRecordableModel extends IRecordable {
  _id: string,
}