import { INode } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export interface IUserStub extends INode {
  name: string;
  username: string;
  avatar?: string;
}

export interface IUser extends IUserStub {
  email: string;
  verified: boolean;
  new_user: boolean;
  admin?: boolean;
  bio?: string;
  cover_image?: string;
  location?: string;
}

export interface IUserPrivate extends IUser {
  salt?: string;
  pw_hash?: string;
}
