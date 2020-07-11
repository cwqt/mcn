import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { sendVerificationEmail } from "./Email.controller";
import { ErrorHandler, FormErrorResponse } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import { uploadImageToS3, S3Image } from "../../common/storage";
import dbs, { cypher } from "../../common/dbs";

import { User } from "../../classes/Users/User.model";
import { Org } from "../../classes/Orgs.model";
import { Node } from "../../classes/Node.model";

import { IUserPrivate, IUser, IOrgStub, NodeType } from "@cxss/interfaces";

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
    let errors = new FormErrorResponse();
    let user = result.records[0].get("u").properties;
    if (user.username == req.body.username)
      errors.push("username", "Username is already taken", req.body.username);
    if (user.email == req.body.email) errors.push("email", "E-mail already in use", req.body.email);
    throw new ErrorHandler(HTTP.Conflict, errors.value);
  }

  let emailSent = await sendVerificationEmail(req.body.email);
  if (!emailSent) throw new ErrorHandler(HTTP.ServerError, "Verification email could not be sent");

  console.log(req.body);

  let user = new User(req.body.username, req.body.email);
  user.generateCredentials(req.body.password);
  await user.create();

  res.status(HTTP.Created).json(user.toUser());
};

export const readUserById = async (req: Request, res: Response) => {
  let user: User = await new Node(NodeType.User, req.params.uid).read();
  res.json(user.toUser());
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
  console.log(r.get("u").properties._id);

  let user: User = await new Node(NodeType.User, r.get("u").properties._id).read();
  res.json(user.toUser());
};

export const updateUser = async (req: Request, res: Response) => {
  var newData: any = {};
  let allowedFields = ["name", "email", "location", "bio", "new_user"];
  let reqKeys = Object.keys(req.body);
  for (let i = 0; i < reqKeys.length; i++) {
    if (!allowedFields.includes(reqKeys[i])) continue;
    newData[reqKeys[i]] = req.body[reqKeys[i]];
  }

  let user: User = await new Node(NodeType.User, req.params.uid).update(newData);
  res.json(user.toUser());
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
  await new Node(NodeType.User, req.params._id).delete();
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
    next(
      new ErrorHandler(HTTP.NotFound, [
        { param: "email", msg: "No such user for this email", value: req.body.email },
      ])
    );

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

    let u: User = await new Node(NodeType.User, user._id).read();
    console.log(u);
    res.json(u.toUser());
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

export const readUserOrgs = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        MATCH (o:Organisation)<-[:IN]-(u)
        RETURN o
    `,
    {
      uid: req.session.user.id,
    }
  );

  let orgs: IOrgStub[] = result.records.map((r: any) => {
    let org = r.get("o").properties;
    return new Org(org.name, org._id).toStub();
  });

  res.json(orgs);
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
  return user.toUser();
};
