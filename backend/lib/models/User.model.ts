import { Document, Schema, Model, model} from "mongoose";

const mongo4j = require('mongo4j');

export interface IUserStub {
    username:       string,
    avatar?:        string,
}

export interface IUser extends IUserStub {
    name:           string,
    email:          string,
    salt:           string,
    pw_hash:        string,
    verified:       boolean,
    new_user:       boolean,
    admin?:         boolean,
    bio?:           string,
    cover_image?:   string,
    location?:      string,
    created_at?:    Date,
    updated_at?:    Date,
    blocked_users?: Array<IUserModel["_id"]>
}

export interface IUserModel extends IUser, Document {
    _id: string,
}

export var UserSchema:Schema = new Schema({
    username:       { type:String, required: true },
    email:          { type:String, required: true },
    salt:           { type:String, required: true },
    pw_hash:        { type:String, required: true },
    verified:       { type:Boolean, required: true, default: false },
    new_user:       { type:Boolean, required: true, default: false },
    admin:          { type:Boolean, default: false },
    name:           String,
    bio:            String,
    location:       String,
    avatar:         String,
    cover_image:    String,
    plant_count:    { type: Number, default: 0},
    garden_count:   { type: Number, default: 0},
    device_count:   { type: Number, default: 0},
    blocked_users: [Schema.Types.ObjectId]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }})

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.salt;
    delete obj.pw_hash;
    delete obj.blocked_users;
    return obj;
}

UserSchema.plugin(mongo4j.plugin());

export const User:Model<IUserModel> = model<IUserModel>("User", UserSchema);

