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

            next();    
        })(req, res, next);
    });
}

export const readAllRecordables = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (x:${getSchema(res.locals.type)})<-[:CREATED]-(:User {_id:$uid})
            RETURN x
        `, {
            uid:req.params.uid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let recordables = result.records.map((record:any) => record.get('x').properties)
    res.json(recordables)
}

export const readRecordable = (req:Request, res:Response) => {

}

export const readRecordableMeasurements = (req:Request, res:Response) => {}

export const updateRecordable = (req:Request, res:Response, next:NextFunction) => {
    let newData:{[index:string]:any} = {};
    let reqKeys = Object.keys(req.body);

    for(let i=0; i<reqKeys.length; i++) newData[reqKeys[i]] = req.body[reqKeys[i]];

    res.locals["newData"] = newData;
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