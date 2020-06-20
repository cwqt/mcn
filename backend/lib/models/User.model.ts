export interface IUserMeta {
  plants: number;
  gardens: number;
  devices: number;
  followers: number;
  following: number;
  hearts: number;
  posts: number;
}

export interface IUserStub {
  _id: string;
  username: string;
  name?: string;
  avatar?: string;
  meta?: IUserMeta;
}

export interface IUser extends IUserStub {
  email: string;
  verified: boolean;
  new_user: boolean;
  admin?: boolean;
  bio?: string;
  cover_image?: string;
  location?: string;
  created_at?: number;
}

export interface IUserPrivate extends IUser {
  salt?: string;
  pw_hash?: string;
}
