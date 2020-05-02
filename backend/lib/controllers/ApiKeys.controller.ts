import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { Plant } from "../models/Plant.model";
import { Garden } from "../models/Garden.model";
import { ApiKey } from "../models/ApiKey.model"
// import { User } from "../models/User.model";
import { ErrorHandler } from "../common/errorHandler";
import { Types } from 'mongoose';

import neode from '../common/neo4j';
import { HTTP } from "../common/http";

const filterFields = (key:any) => {
  let hiddenFields = ["key"];
  hiddenFields.forEach(field => delete key[field]);
  return key;
}

export const createApiKey = async (req:Request, res:Response) => {
  let device_id = req.params.did
  let key_name = req.body.key_name
  let recordable_type = req.body.recordable_type

  let token = await jwt.sign({
    did: device_id,
    typ: recordable_type,
    iat: Date.now()
  }, config.PRIVATE_KEY);
  
  let key = {
    key: token,
    key_name: key_name,
    created_at: Date.now(),
    _id: Types.ObjectId().toHexString()
  }

  //create key & assign to device
  let results = await neode.instance.cypher(`
    MATCH (d:Device {_id:$did})
    CREATE (a:ApiKey $body)
    MERGE (d)-[m:HAS_KEY]->(a)
    RETURN a
  `, {
      did: device_id,
      body: key
  })

  console.log(results)

  if(!results.records.length) throw new ErrorHandler(HTTP.ServerError);
  res.status(HTTP.Created).json(results.records[0].get('a').properties);
}

export const readApiKey = async (req:Request, res:Response) => {
  let results = await neode.instance.cypher(`
    MATCH (a:ApiKey {_id:$kid})
    RETURN a
  `, {
    kid: req.params.kid
  })

  if(!results.records.length) throw new ErrorHandler(HTTP.ServerError)
  res.status(HTTP.Created).json(filterFields(results.records[0].get('a').properties))
}

export const deleteApiKey = async (req:Request, res:Response) => {}
