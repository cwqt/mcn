import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

export interface IUser extends Document {
    name:           string,
    username:       string,
    email:          string,
    salt:           string,
    pw_hash:        string,
    verified:       boolean,
    admin?:          boolean,
    bio?:           string,
    avatar?:        string,
    cover_image?:   string,
    location?:      string,
    created_at?:    Date,
    modified_at?:   Date,
    blocked_users?: IUser[]
}

export var UserSchema:Schema = new Schema({
    username:       { type:String, required:true },
    email:          { type:String, required:true },
    salt:           { type:String, required:true },
    pw_hash:        { type:String, required:true },
    verified:       { type:Boolean, required: true },
    admin:          Boolean,
    name:           String,
    bio:            String,
    location:       String,
    avatar:         String,
    cover_image:    String,
    blocked_users: [Schema.Types.ObjectId]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

export const User:Model<IUser> = model<IUser>("User", UserSchema);
