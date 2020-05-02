import { Document, Schema, Model, model} from "mongoose";
import neode from '../common/neo4j';
import { Types } from "mongoose";

export interface IUserStub {
    username:       string,
    avatar?:        string,
}

export interface IUser extends IUserStub {
    name:           string,
    email:          string,
    verified:       boolean,
    new_user:       boolean,
    salt?:          string,
    pw_hash?:       string,
    admin?:         boolean,
    bio?:           string,
    cover_image?:   string,
    location?:      string,
    created_at?:    Date,
    updated_at?:    Date,
}

export interface IUserModel extends IUser, Document {
    _id: string,
    plants: number,
    gardens: number,
    devices: number,
    followers: number,
    following: number,
    hearts: number,
    posts: number,
}