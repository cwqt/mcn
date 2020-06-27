import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { sendVerificationEmail } from "./Email.controller";
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import config from "../../config";
import { uploadImageToS3, S3Image } from "../../common/storage";
import dbs, { cypher } from "../../common/dbs";
import { Types } from "mongoose";

import { IUserStub, IUser, IUserPrivate } from "../../models/Users/User.model";
// import { IOrgStub } from "../../models/Orgs.model";
import { Node } from "../../models/Node.model";
import { createNode, readNode } from "../Node.controller";

export const filterUserFields = (user: any, toStub?: boolean): IUser | IUserStub => {
  let hiddenFields = ["_labels", "pw_hash", "salt"];
  if (toStub)
    hiddenFields = hiddenFields.concat([
      "email",
      "admin",
      "new_user",
      "created_at",
      "verified",
      "gardens",
      "plants",
      "devices",
      "hearts",
      "followers",
      "following",
      "location",
      "posts",
      "bio",
    ]);

  hiddenFields.forEach((field) => delete user[field]);
  return user;
};

export const readAllUsers = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (u:User)
        RETURN u
    `,
    {}
  );

  let users: IUser[] = result.records.map((record: any) =>
    filterUserFields(record.get("u").properties)
  );
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  //see if username/email already taken
  let result = await cypher(
    `
        MATCH (u:User)
        WHERE u.email = $email OR u.username = $username
        RETURN u
    `,
    {
      email: req.body.email,
      username: req.body.username,
    }
  );

  if (result.records.length) {
    let errors = [];
    let user = result.records[0].get("u").properties;
    if (user.username == req.body.username)
      errors.push({ param: "username", msg: "username is taken" });
    if (user.email == req.body.email) errors.push({ param: "email", msg: "email already in use" });
    throw new ErrorHandler(HTTP.Conflict, errors);
  }

  let emailSent = await sendVerificationEmail(req.body.email);
  if (!emailSent) throw new ErrorHandler(HTTP.ServerError, "Verification email could not be sent");

  //generate password hash
  let salt = await bcrypt.genSalt(10);
  let pw_hash = await bcrypt.hash(req.body["password"], salt);

  let user: IUserPrivate = {
    _id: Types.ObjectId().toHexString(),
    name: "",
    username: req.body.username,
    email: req.body.email,
    verified: false,
    new_user: true,
    salt: salt,
    pw_hash: pw_hash,
    admin: false,
    created_at: Date.now(),
  };

  let u = filterUserFields(await createNode(Node.User, user));
  res.status(HTTP.Created).json(u);
};

export const readUserById = async (req: Request, res: Response) => {
  res.json(filterUserFields(await readNode(Node.User, req.params.uid)));
};

export const readUserByUsername = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (u:User {username: $username})
        RETURN u
    `,
    {
      username: req.params.username,
    }
  );

  let r = result.records[0];
  if (!r || r.get("u") == null) throw new ErrorHandler(HTTP.NotFound, "No such user exists");
  res.json(filterUserFields(await readNode(Node.User, r.get("u").properties._id)));
};

export const updateUser = async (req: Request, res: Response) => {
  var newData: any = {};
  let allowedFields = ["name", "email", "location", "bio", "new_user"];
  let reqKeys = Object.keys(req.body);
  for (let i = 0; i < reqKeys.length; i++) {
    if (!allowedFields.includes(reqKeys[i])) continue;
    newData[reqKeys[i]] = req.body[reqKeys[i]];
  }

  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        SET u += $body
        RETURN u
    `,
    {
      uid: req.params.uid,
      body: newData,
    }
  );

  let user = result.records[0].get("u").properties;
  res.json(filterUserFields(user));
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    let user = await updateImage(req.params.uid, req.file, "avatar");
    res.json(user);
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }
};

export const updateUserCoverImage = async (req: Request, res: Response) => {
  try {
    let user = await updateImage(req.params.uid, req.file, "cover_image");
    res.json(user);
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  await cypher(
    `
        MATCH (u:User {_id:$uid})
        DETACH DELETE u
    `,
    {
      uid: req.params.uid,
    }
  );

  res.status(HTTP.OK).end();
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  let email = req.body.email;
  let password = req.body.password;

  //find user by email
  let result = await cypher(
    `
        MATCH (u:User {email: $email})
        RETURN u
    `,
    {
      email: email,
    }
  );
  if (!result.records.length)
    next(new ErrorHandler(HTTP.NotFound, [{ param: "email", msg: "No such user for this email" }]));

  let user: IUserPrivate = result.records[0].get("u").properties;
  if (!user.verified)
    next(
      new ErrorHandler(HTTP.Unauthorised, [
        { param: "form", msg: "Your account has not been verified" },
      ])
    );

  try {
    let match = await bcrypt.compare(password, user.pw_hash);
    if (!match)
      next(new ErrorHandler(HTTP.Unauthorised, [{ param: "password", msg: "Incorrect password" }]));

    req.session.user = {
      id: user._id,
      admin: user.admin || false,
    };

    user = (await readNode(Node.User, user._id)) as IUser;
    res.json(filterUserFields(user));
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(new ErrorHandler(HTTP.ServerError, "Logging out failed"));
      res.status(HTTP.OK).end();
    });
  }
};

// export const readUserOrgs = async (req: Request, res: Response) => {
//   let result = await cypher(
//     `
//         MATCH (u:User {_id:$uid})
//         MATCH (o:Organisation)<-[:IN]-(u)
//         RETURN o
//     `,
//     {
//       uid: req.session.user.id,
//     }
//   );

//   let orgs: IOrgStub[] = result.records.map((r: any) => {
//     return {
//       _id: r.get("o").properties._id,
//       name: r.get("o").properties.name,
//       created_at: r.get("o").properties.created_at,
//     } as IOrgStub;
//   });

//   res.json(orgs);
// };

// HELPER FUNCTIONS ===============================================================================

const updateImage = async (user_id: string, file: Express.Multer.File, field: string) => {
  let image: S3Image;
  try {
    image = (await uploadImageToS3(user_id, file, field)) as S3Image;
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }

  let session = dbs.neo4j.session();
  let result;
  try {
    result = await session.run(
      `
            MATCH (u:User {_id: "${user_id}"})
            SET u.${field} = '${image.data.Location}'
            RETURN u
        `,
      {}
    );
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  } finally {
    session.close();
  }

  return filterUserFields(result.records[0].get("u").properties);
};
