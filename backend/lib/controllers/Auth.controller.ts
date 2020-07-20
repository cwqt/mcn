import { Request, Response } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../common/validate";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import config from "../config";
import { ErrorHandler } from "../common/errorHandler";
import { cypher } from "../common/dbs";
import { HTTP } from "../common/http";
import { IApiKeyPrivate } from "@cxss/interfaces";
import Email from "./Users/Email.controller";
import { env } from "process";

export const validators = {
  verify: validate([
    query("email").isEmail().normalizeEmail().withMessage("not a valid email address"),
    query("hash").not().isEmpty().trim().withMessage("must have a verification hash"),
  ]),
};

const filterFields = (key: any) => {
  let hiddenFields = ["key"];
  hiddenFields.forEach((field) => delete key[field]);
  return key;
};

export const verifyEmail = async (req: Request) => {
  await Email.verifyEmail(req.body.email, req.body.password);
};

export const createApiKey = async (req: Request) => {
  let device_id = req.params.did;
  let key_name = req.body.key_name;

  let token = await jwt.sign(
    {
      did: device_id,
      iat: Date.now(),
    },
    config.PRIVATE_KEY
  );

  let key: IApiKeyPrivate = {
    key: token,
    key_name: key_name,
    created_at: Date.now(),
    _id: Types.ObjectId().toHexString(),
  };

  let result = await cypher(
    `
      MATCH (d:Device {_id:$did})
      CREATE (a:ApiKey $body)
      MERGE (d)-[m:HAS_KEY]->(a)
      RETURN a
    `,
    {
      did: device_id,
      body: key,
    }
  );

  if (!result.records.length) throw new ErrorHandler(HTTP.ServerError, "createApiKeyError");
  return result.records[0].get("a").properties;
};

export const readApiKey = async (req: Request) => {
  let result = await cypher(
    `
      MATCH (a:ApiKey {_id:$kid})
      RETURN a
    `,
    {
      kid: req.params.kid,
    }
  );

  if (!result.records.length) throw new ErrorHandler(HTTP.ServerError, "readApiKeyError");
  return filterFields(result.records[0].get("a").properties);
};

export const deleteApiKey = async (req: Request) => {};
