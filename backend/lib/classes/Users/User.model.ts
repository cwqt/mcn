import { INode, Node, NodeType } from "../Node.model";
// import bcrypt from "bcrypt";

export class User extends Node {
  name: string;
  username: string;
  email: string;
  verified: boolean;
  new_user: boolean;
  avatar?: string;
  admin?: boolean;
  bio?: string;
  cover_image?: string;
  location?: string;
  salt?: string;
  pw_hash?: string;

  constructor(username: string, email: string) {
    super(NodeType.User);
    this.username = username;
    this.email = email;
    this.verified = false;
    this.new_user = true;
    this.admin = false;
  }

  async generateCredentials(password: string) {
    // this.salt = await bcrypt.genSalt(10);
    // this.pw_hash = await bcrypt.hash(password, this.salt);
  }

  toStub(): IUserStub {
    return {
      ...super.toStub(),
      name: this.name,
      username: this.username,
      avatar: this.avatar,
      type: this.type,
    };
  }

  toUser(): IUser {
    return {
      ...this.toStub(),
      email: this.email,
      verified: this.verified,
      new_user: this.new_user,
      cover_image: this.cover_image,
      location: this.location,
      bio: this.bio,
      admin: this.admin,
    };
  }

  toPrivate(): IUserPrivate {
    return {
      ...this.toUser(),
      salt: this.salt,
      pw_hash: this.pw_hash,
    };
  }
}

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
