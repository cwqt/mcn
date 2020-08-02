import { NodeType, IUser, IUserStub, IUserPrivate, DataModel, INode } from "@cxss/interfaces";
import bcrypt from "bcrypt";
import Node from "../Node.model";

type TUser = IUserPrivate | IUser | IUserStub;

const read = async <T extends TUser>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub: {
    }

    case DataModel.Full: {
    }

    case DataModel.Private: {
    }
  }

  return reduce<T>(data, dataModel);
};

//hack the typing to give me what I want, since IUserPrivate has all props
// e.g. User.reduce<IUser>(privateUser, DataModel.Full) --> IUser;
const reduce = <K extends TUser>(data: TUser, dataModel: DataModel = DataModel.Stub): K => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IUserStub = {
        ...Node.reduce(data),
        name: (<IUserStub>data).name,
        username: (<IUserStub>data).username,
        avatar: (<IUserStub>data).avatar,
      };
      return r as K;
    }

    case DataModel.Full: {
      let d = <IUser>data;
      let r: IUser = {
        ...reduce<IUserStub>(data, DataModel.Stub),
        email: d.email,
        verified: d.verified,
        new_user: d.new_user,
        admin: d.admin,
        bio: d.bio,
        cover_image: d.cover_image,
        location: d.location,
      };
      return r as K;
    }

    case DataModel.Private: {
      let d = <IUserPrivate>data;
      let r: IUserPrivate = {
        ...reduce<IUser>(data, DataModel.Full),
        salt: d.salt,
        pw_hash: d.pw_hash,
      };
      return r as K;
    }
  }
};

export default { read, reduce };

// export class User extends Node {
//   name: string;
//   username: string;
//   email: string;
//   verified: boolean;
//   new_user: boolean;
//   avatar?: string;
//   admin?: boolean;
//   bio?: string;
//   cover_image?: string;
//   location?: string;
//   salt?: string;
//   pw_hash?: string;

//   constructor(username: string, email: string) {
//     super(NodeType.User);
//     this.username = username;
//     this.email = email;
//     this.verified = false;
//     this.new_user = true;
//     this.admin = false;
//   }

//   async generateCredentials(password: string) {
//     this.salt = await bcrypt.genSalt(10);
//     this.pw_hash = await bcrypt.hash(password, this.salt);
//   }

//   toStub(): IUserStub {
//     return {
//       ...super.toStub(),
//       name: this.name,
//       username: this.username,
//       avatar: this.avatar,
//     };
//   }

//   toFull(): IUser {
//     return {
//       ...this.toStub(),
//       email: this.email,
//       verified: this.verified,
//       new_user: this.new_user,
//       cover_image: this.cover_image,
//       location: this.location,
//       bio: this.bio,
//       admin: this.admin,
//     };
//   }

//   toPrivate(): IUserPrivate {
//     return {
//       ...this.toFull(),
//       salt: this.salt,
//       pw_hash: this.pw_hash,
//     };
//   }
// }
