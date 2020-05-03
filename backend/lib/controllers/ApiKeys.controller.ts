import jwt                    from "jsonwebtoken";
import { Request, Response, } from 'express';
import { Types }              from 'mongoose';

import config           from '../config';
import { ErrorHandler } from "../common/errorHandler";
import { n4j }          from '../common/neo4j';
import { HTTP }         from "../common/http";
import { IApiKeyPrivate } from '../models/ApiKey.model';

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
  
  let key:IApiKeyPrivate = {
    key: token,
    key_name: key_name,
    type: recordable_type,
    created_at: Date.now(),
    _id: Types.ObjectId().toHexString()
  }
  
  let session = n4j.session();
  let result;
  try {
    result = await session.run(`
      MATCH (d:Device {_id:$did})
      CREATE (a:ApiKey $body)
      MERGE (d)-[m:HAS_KEY]->(a)
      RETURN a
    `, {
        did: device_id,
        body: key
    })
  } catch(e) {
    throw new ErrorHandler(HTTP.ServerError, e)
  } finally {
    session.close();
  }

  if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, 'createApiKeyError');
  res.status(HTTP.Created).json(result.records[0].get('a').properties);
}

export const readApiKey = async (req:Request, res:Response) => {
  let session = n4j.session();
  let result;
  try {
    result = await session.run(`
      MATCH (a:ApiKey {_id:$kid})
      RETURN a
    `, {
      kid: req.params.kid
    })    
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e)
  } finally {
    session.close();
  }

  if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, 'readApiKeyError')
  res.status(HTTP.Created).json(filterFields(result.records[0].get('a').properties))
}

export const deleteApiKey = async (req:Request, res:Response) => {}
