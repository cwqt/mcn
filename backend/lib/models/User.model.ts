import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

export interface IUser extends Document {
    name:       string,
    email:      string,
    salt:       string,
    pw_hash:    string,
    admin:      boolean
    created_at?: Date,
    modified_at?:Date,
    avatar?:     string,
}

export var UserSchema:Schema = new Schema({
    name:       { type:String, required:true },
    email:      { type:String, required:true },
    salt:       { type:String, required:true },
    pw_hash:    { type:String, required:true },
    admin:      { type:Boolean, default:false },
    created_at: Date,
    modified_at:Date,
    avatar:     String,
}).pre<IUser>('save', function (next) {
    if (this.isNew) {
      this.created_at = new Date();
    } else {
      this.modified_at = new Date();
    }
    next();
  });

export const User:Model<IUser> = model<IUser>("User", UserSchema);
