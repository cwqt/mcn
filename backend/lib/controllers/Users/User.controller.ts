import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import Auth = require("../Auth.controller");
import { ErrorHandler, FormErrorResponse } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import { uploadImageToS3, S3Image } from "../../common/storage";
import dbs, { cypher } from "../../common/dbs";

import {
  IUserPrivate,
  IUser,
  IOrgStub,
  NodeType,
  Paginated,
  IUserStub,
  DataModel,
} from "@cxss/interfaces";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";
import User from "../../classes/Users/User.model";
import { Types } from "mongoose";
import Node from "../../classes/Node.model";

export const validators = {
  loginUser: validate([
    body("email")
      .not()
      .isEmpty()
      .withMessage("Must provide an e-mail address")
      .isEmail()
      .normalizeEmail()
      .withMessage("Not a valid e-mail address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password length must be > 6 characters"),
  ]),
  createUser: validate([
    body("username").not().isEmpty().trim().withMessage("Username cannot be empty"),
    body("email").isEmail().normalizeEmail().withMessage("Not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password length must be > 6 characters"),
  ]),
  readUserByUsername: validate([param("username").not().isEmpty().trim()]),
};

// export const readAllUsers = async (req: Request): Promise<Paginated<IUserStub>> => {
//   const page: number = parseInt(req.query.page as string);
//   const per_page: number = parseInt(req.query.per_page as string);
//   let result = await cypher(
//     `
//     MATCH (u:User)
//     RETURN u
//   `,
//     {}
//   );
//   let results: IUserStub[] = result.records[0]
//     .get("u")
//     .map((r: any) => objToClass(NodeType.User, r.properties).toStub());
//   return createPaginator(NodeType.User, results, results.length, per_page);
// };

export const createUser = async (req: Request, next: NextFunction): Promise<IUser> => {
  //see if username/email already taken
  let result = await cypher(
    ` MATCH (u:User)
      WHERE u.email = $email OR u.username = $username
      RETURN u`,
    {
      email: req.body.email,
      username: req.body.username,
    }
  );

  if (result.records.length) {
    let errors = new FormErrorResponse();
    let user = result.records[0].get("u").properties;
    if (user.username == req.body.username)
      errors.push("username", "Username is already taken", req.body.username);
    if (user.email == req.body.email) errors.push("email", "E-mail already in use", req.body.email);
    throw new ErrorHandler(HTTP.Conflict, errors.value);
  }

  const emailSent = await Auth.sendVerificationEmail(req.body.email);
  if (!emailSent) throw new ErrorHandler(HTTP.ServerError, "Verification email could not be sent");

  let user: IUserStub = {
    name: req.body.name,
    username: req.body.username,
    created_at: Date.now(),
    _id: Types.ObjectId().toHexString(),
    type: NodeType.User,
  };

  return await User.create(user, req.body.password);
};

export const readUserById = async (req: Request): Promise<IUser> => {
  return await User.read<IUser>(req.params.uid, DataModel.Full);
};

export const readUserByUsername = async (req: Request, next: NextFunction): Promise<IUser> => {
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

  return User.read<IUser>(r.get("u").properties._id, DataModel.Full);
};

export const updateUser = async (req: Request): Promise<IUser> => {
  return await User.update(req.params.uid, req.body);
};

export const updateUserAvatar = async (req: Request) => {
  try {
    let user = await updateImage(req.params.uid, req.file, "avatar");
    return user;
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }
};

// export const updateUserCoverImage = async (req: Request, res: Response) => {
//   try {
//     let user = await updateImage(req.params.uid, req.file, "cover_image");
//     res.json(user);
//   } catch (e) {
//     throw new ErrorHandler(HTTP.ServerError, e);
//   }
// };

export const deleteUser = async (req: Request) => {
  await Node.remove(req.params.uid, NodeType.User);
};

export const loginUser = async (req: Request, next: NextFunction): Promise<IUser> => {
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
    throw new ErrorHandler(HTTP.NotFound, [
      { param: "email", msg: "No such user for this email", value: req.body.email },
    ]);

  let user: IUserPrivate = result.records[0].get("u").properties;
  if (!user.verified)
    throw new ErrorHandler(HTTP.Unauthorised, [
      { param: "form", msg: "Your account has not been verified" },
    ]);

  let match = await bcrypt.compare(password, user.pw_hash);
  if (!match)
    throw new ErrorHandler(HTTP.Unauthorised, [{ param: "password", msg: "Incorrect password" }]);

  req.session.user = {
    _id: user._id,
    admin: user.admin || false,
  };

  return await User.read(user._id, DataModel.Full);
};

export const logoutUser = async (req: Request, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) throw new ErrorHandler(HTTP.ServerError, "Logging out failed");
    return;
  });
};

export const readUserOrgs = async (req: Request) => {
  // let result = await cypher(
  //   `
  //       MATCH (u:User {_id:$uid})
  //       MATCH (o:Organisation)<-[:IN]-(u)
  //       RETURN o
  //   `,
  //   {
  //     uid: req.params.uid,
  //   }
  // );
  // let orgs: IOrgStub[] = result.records.map((r: any) => {
  //   let org = r.get("o").properties;
  //   return new Org(org.name, org._id).toStub();
  // });
  // return orgs;
};

// HELPER FUNCTIONS ===============================================================================

const updateImage = async (
  user_id: string,
  file: Express.Multer.File,
  field: string
): Promise<IUser> => {
  let image: S3Image;
  try {
    image = (await uploadImageToS3(user_id, file, field)) as S3Image;
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  }

  return await User.update(user_id, { [field]: image.data.Location });
};
