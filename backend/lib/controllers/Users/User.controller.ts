import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import Auth = require("../Auth.controller");
import { ErrorHandler, FormErrorResponse } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import { uploadImageToS3, S3Image } from "../../common/storage";
import dbs, { cypher } from "../../common/dbs";

import { User } from "../../classes/Users/User.model";
import { Org } from "../../classes/Orgs.model";
import { Node, objToClass } from "../../classes/Node.model";

import { IUserPrivate, IUser, IOrgStub, NodeType, Paginated, IUserStub } from "@cxss/interfaces";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";
import config from "../../config";
import { createPaginator } from "../Node.controller";
import { notEqual } from "assert";

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

export const readAllUsers = async (req: Request): Promise<Paginated<IUserStub>> => {
  const page: number = parseInt(req.query.page as string);
  const per_page: number = parseInt(req.query.per_page as string);

  let result = await cypher(
    `
    MATCH (u:User)
    RETURN u
  `,
    {}
  );

  let results: IUserStub[] = result.records[0]
    .get("u")
    .map((r: any) => objToClass(NodeType.User, r.properties).toStub());

  return createPaginator(NodeType.User, results, results.length, per_page);
};

export const createUser = async (req: Request, next: NextFunction): Promise<IUser | void> => {
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
    let errors = new FormErrorResponse();
    let user = result.records[0].get("u").properties;
    if (user.username == req.body.username)
      errors.push("username", "Username is already taken", req.body.username);
    if (user.email == req.body.email) errors.push("email", "E-mail already in use", req.body.email);
    return next(new ErrorHandler(HTTP.Conflict, errors.value));
  }

  let emailSent = await Auth.sendVerificationEmail(req.body.email);
  if (!emailSent)
    return next(new ErrorHandler(HTTP.ServerError, "Verification email could not be sent"));

  let user = new User(req.body.username, req.body.email);
  await user.generateCredentials(req.body.password);
  await user.create();

  return user.toFull();
};

export const readUserById = async (req: Request) => {
  let user: User = await new Node(NodeType.User, req.params.uid).read();
  return user.toFull();
};

export const readUserByUsername = async (req: Request, next: NextFunction) => {
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
  if (!r || r.get("u") == null) return next(new ErrorHandler(HTTP.NotFound, "No such user exists"));

  let user: User = await new Node(NodeType.User, r.get("u").properties._id).read();
  return user.toFull();
};

export const updateUser = async (req: Request): Promise<IUser> => {
  var newData: any = {};
  let allowedFields = ["name", "email", "location", "bio", "new_user"];
  let reqKeys = Object.keys(req.body);
  for (let i = 0; i < reqKeys.length; i++) {
    if (!allowedFields.includes(reqKeys[i])) continue;
    newData[reqKeys[i]] = req.body[reqKeys[i]];
  }

  let user: User = await new Node(NodeType.User, req.params.uid).update(newData);
  return user.toFull();
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
  await new Node(NodeType.User, req.params._id).delete();
  return;
};

export const loginUser = async (req: Request, next: NextFunction): Promise<IUser | void> => {
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
    return next(
      new ErrorHandler(HTTP.NotFound, [
        { param: "email", msg: "No such user for this email", value: req.body.email },
      ])
    );

  let user: IUserPrivate = result.records[0].get("u").properties;
  if (!user.verified)
    return next(
      new ErrorHandler(HTTP.Unauthorised, [
        { param: "form", msg: "Your account has not been verified" },
      ])
    );

  let match = await bcrypt.compare(password, user.pw_hash);
  if (!match)
    return next(
      new ErrorHandler(HTTP.Unauthorised, [{ param: "password", msg: "Incorrect password" }])
    );

  req.session.user = {
    _id: user._id,
    admin: user.admin || false,
  };

  let u: User = await new Node(NodeType.User, user._id).read();
  return u.toFull();
};

export const logoutUser = async (req: Request, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) return next(new ErrorHandler(HTTP.ServerError, "Logging out failed"));
    return;
  });
};

export const readUserOrgs = async (req: Request) => {
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        MATCH (o:Organisation)<-[:IN]-(u)
        RETURN o
    `,
    {
      uid: req.params.uid,
    }
  );

  let orgs: IOrgStub[] = result.records.map((r: any) => {
    let org = r.get("o").properties;
    return new Org(org.name, org._id).toStub();
  });

  return orgs;
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

  let user: User = await new Node(NodeType.User, user_id).update({ [field]: image.data.Location });
  return user.toFull();
};
