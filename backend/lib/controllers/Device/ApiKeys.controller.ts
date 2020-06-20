import jwt                    from "jsonwebtoken";
import { Request, Response, } from 'express';
import { Types }              from 'mongoose';

import config           from '../../config';
import { ErrorHandler } from "../../common/errorHandler";
import { cypher }          from '../../common/dbs';
import { HTTP }         from "../../common/http";
import { IApiKeyPrivate } from '../../models/Device/ApiKey.model';

const filterFields = (key:any) => {
  let hiddenFields = ["key"];
  hiddenFields.forEach(field => delete key[field]);
  return key;
}

export const createApiKey = async (req:Request, res:Response) => {
  let device_id = req.params.did
  let key_name = req.body.key_name

  let token = await jwt.sign({
    did: device_id,
    iat: Date.now()
  }, config.PRIVATE_KEY);
  
  let key:IApiKeyPrivate = {
    key: token,
    key_name: key_name,
    created_at: Date.now(),
    _id: Types.ObjectId().toHexString()
  }
  
  let result = await cypher(`
    MATCH (d:Device {_id:$did})
    CREATE (a:ApiKey $body)
    MERGE (d)-[m:HAS_KEY]->(a)
    RETURN a
  `, {
      did: device_id,
      body: key
  })

  if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, 'createApiKeyError');
  res.status(HTTP.Created).json(result.records[0].get('a').properties);
}

export const readApiKey = async (req:Request, res:Response) => {
  let result = await cypher(`
    MATCH (a:ApiKey {_id:$kid})
    RETURN a
  `, {
    kid: req.params.kid
  })    

  if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, 'readApiKeyError')
  res.status(HTTP.Created).json(filterFields(result.records[0].get('a').properties))
}

export const deleteApiKey = async (req:Request, res:Response) => {}
