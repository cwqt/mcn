import { cypher } from "../common/dbs";

export enum Node {
  User = "user",
  Organisation = "organisation",
  Farm = "farm",
  Rack = "rack",
  Crop = "crop",
  Device = "device",
  Post = "post",
}

//adding measurements / getting off / constructing graphs
export type RecordableType = Node.Device | Node.Farm | Node.Rack | Node.Crop;

//posts, favouriting / pinning
export type PostableType = Node.Post | Node.Device | Node.Farm | Node.Crop | Node.Rack;

//hydroponics stuff
export type Florable = Node.Farm | Node.Rack | Node.Crop;

//adding / removing to/from org
export type OrgItemType = Node.User | Node.Device | Node.Farm | Node.Rack | Node.Crop;

export interface INode {
  _id: string;
  created_at: number; //seconds since epoch
}

export interface IRecordable extends INode {
  type: RecordableType;
}

export interface IFlorable extends IRecordable {}

export interface IPostable extends INode {}
