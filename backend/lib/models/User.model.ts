import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

export interface IUser extends Document {
    name:           string,
    email:          string,
    salt:           string,
    pw_hash:        string,
    admin:          boolean
    created_at?:    Date,
    modified_at?:   Date,
    avatar?:        string,
    cover_image?:   string,
    location?:       string,
}

export var UserSchema:Schema = new Schema({
    name:           { type:String, required:true },
    email:          { type:String, required:true },
    salt:           { type:String, required:true },
    pw_hash:        { type:String, required:true },
    admin:          { type:Boolean, default:false },
    location:       String,
    avatar:         String,
    cover_image:    String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const User:Model<IUser> = model<IUser>("User", UserSchema);
