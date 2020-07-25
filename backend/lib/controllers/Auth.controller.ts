import { Request, Response } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../common/validate";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import config from "../config";
import { ErrorHandler } from "../common/errorHandler";
import { cypher } from "../common/dbs";
import { HTTP } from "../common/http";
import { IApiKeyPrivate, IApiKey } from "@cxss/interfaces";
const { generateVerificationHash, verifyHash } = require("dbless-email-verification");
import nodemailer from "nodemailer";
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

export const createApiKey = async (req: Request): Promise<IApiKey> => {
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

// EMAIL ------------------------------------------------------------------------------------------

const generateEmailHash = (email: string) => {
  const hash = generateVerificationHash(email, config.PRIVATE_KEY, 60);
  return hash;
};

export const verifyEmail = (email: string, hash: string) => {
  if (!config.PRODUCTION) return true;
  const isEmailVerified = verifyHash(hash, email, config.PRIVATE_KEY);
  return isEmailVerified;
};

export const sendVerificationEmail = (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (config.PRODUCTION == false) {
      resolve(true);
      return;
    }

    let hash = generateEmailHash(email);
    let verificationUrl = `${config.API_URL}/auth/verify?email=${email}&hash=${hash}`;

    let transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: config.SENDGRID_USERNAME,
        pass: config.SENDGRID_API_KEY,
      },
    });

    let mailOptions = {
      from: config.EMAIL_ADDRESS,
      to: email,
      subject: `Verify your ${config.SITE_TITLE} account 🌱`,
      html: `<p>Click the link to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    transporter.sendMail(mailOptions, (error: any) => {
      if (error) {
        console.log(error);
        resolve(false);
      }
      resolve(true);
    });
  });
};

export const verifyUserEmail = async (req: Request): Promise<string> => {
  let hash = req.query.hash as string;
  let email = req.query.email as string;

  let isVerified = verifyEmail(email, hash);
  if (!isVerified) throw new ErrorHandler(HTTP.BadRequest, "Not a valid hash");

  let result = await cypher(
    `
        MATCH (u:User {email: $email})
        SET u.verified = TRUE
        RETURN u`,
    {
      email: email,
    }
  );

  let u = result.records[0].get("u").properties;
  if (!u.verified) return `${config.FE_URL}/verified?state=false`;

  return `${config.FE_URL}/verified?state=true`;
};
