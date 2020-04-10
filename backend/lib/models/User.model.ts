import * as mongoose from 'mongoose';
import { Document, Schema, Model, model} from "mongoose";

export interface IUser {
    name:           string,
    username:       string,
    email:          string,
    salt:           string,
    pw_hash:        string,
    verified:       boolean,
    new_user:       boolean,
    admin?:         boolean,
    bio?:           string,
    avatar?:        string,
    cover_image?:   string,
    location?:      string,
    created_at?:    Date,
    updated_at?:    Date,
    blocked_users?: Array<IUserModel["_id"]>
}

export interface IUserModel extends IUser, Document {}

export var UserSchema:Schema = new Schema({
    username:       { type:String, required:true },
    email:          { type:String, required:true },
    salt:           { type:String, required:true },
    pw_hash:        { type:String, required:true },
    verified:       { type:Boolean, required: true },
    new_user:       { type: Boolean, required:true },
    admin:          Boolean,
    name:           String,
    bio:            String,
    location:       String,
    avatar:         String,
    cover_image:    String,
    blocked_users: [Schema.Types.ObjectId]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.salt;
    delete obj.pw_hash;
    delete obj.blocked_users;
    return obj;
}

export const User:Model<IUserModel> = model<IUserModel>("User", UserSchema);

