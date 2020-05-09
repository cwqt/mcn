import { Request, Response, NextFunction } from "express"
import { Types } from "mongoose";
const { body } = require('express-validator');

import { RecordableType }  from "../models/Recordable.model"
import { validate }         from "../common/validate";
import { IPlant }           from "../models/Plant.model";
import { IGarden }          from "../models/Garden.model";
import { ErrorHandler }     from "../common/errorHandler";
import { HTTP }             from "../common/http";
import { n4j }              from '../common/neo4j';

import { IRecordable, IRecordableStub } from '../models/Recordable.model';

const getSchema = (recordable_type:string):string => {
    switch(recordable_type) {
        case RecordableType.Plant:     return 'Plant';
        case RecordableType.Garden:    return 'Garden';
    }
}

export const createRecordable = async (req:Request, res:Response, next:NextFunction) => {
    validate([body('name').not().isEmpty().trim()])(req, res, () => {
        ((req:Request, res:Response, next:NextFunction) => {
            //should really use transactions
            req.body["type"] = res.locals.type;
            req.body["_id"] = new Types.ObjectId().toHexString(),
            req.body["created_at"] = Date.now()

            next();    
        })(req, res, next);
    });
}

export const readAllRecordables = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (r:${getSchema(res.locals.type)})<-[:CREATED]-(:User {_id:$uid})
            RETURN r
        `, {
            uid:req.params.uid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let recordables:IRecordableStub[] = result.records.map((record:any) => {
        let r = record.get('r').properties;
        console.log(r)
        return {
            name: r.name,
            _id: r._id,
            thumbnail: r.thumbnail ?? undefined,
            created_at: r.created_at,
            type: r.type        
        } as IRecordableStub;
    });

    res.json(recordables);
}

export const readRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (r {_id:$rid})
            WHERE r:Plant OR r:Garden
            RETURN r    
        `, {
            rid: req.params.rid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let recordable:any = result.records[0]?.get('r').properties;
    if(!recordable) throw new ErrorHandler(HTTP.NotFound, "No such recordable exists");
    if(recordable.parameters) recordable.parameters = JSON.parse(recordable.parameters);

    res.json(recordable);
}

export const updateRecordable = (req:Request, res:Response, next:NextFunction) => {
    res.locals.allowed = ['name', 'images', 'feed_url', 'parameters'];
    next();
}

export const deleteRecordable = (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    let result;
    try {
        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    res.status(HTTP.OK).end()
}