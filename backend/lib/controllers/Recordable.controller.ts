import { Request, Response, NextFunction }    from "express"
const { body } = require('express-validator');

import { IRecordable, RecordableTypes }  from "../models/Recordable.model"
import { validate }                     from "../common/validate";
import {  IPlant }           from "../models/Plant.model";
import {  IGarden }         from "../models/Garden.model";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { Model, Schema } from "mongoose";


import { n4j } from '../common/neo4j';
import { Types } from "mongoose";

const getSchema = (recordable_type:string):string => {
    switch(recordable_type) {
        case RecordableTypes.Plant:     return 'Plant';
        case RecordableTypes.Garden:    return 'Garden';
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
    // let result = await neode.instance.cypher(`
    //     MATCH (x:${getSchema(res.locals.type)})<-[:CREATED]-(:User {_id:$uid})
    //     RETURN x
    // `, {
    //     uid:req.params.uid
    // })

    // let recordables = result.records.map(recordable => recordable.get('x').properties)
    // res.json(recordables)
}

// export const readRecordable = (req:Request, res:Response, next:NextFunction) => {
//     getSchema(res.locals.type).findById(req.params.rid, (error:any, recordable:IPlantModel | IGardenModel) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         if(!recordable) return next(new ErrorHandler(HTTP.NotFound, `no such ${res.locals.type} exists`));
//         res.json(recordable);
//     })
// }

// export const updateRecordable = (req:Request, res:Response, next:NextFunction) => {
//     let newData:{[index:string]:any} = {};
//     let reqKeys = Object.keys(req.body);

//     for(let i=0; i<reqKeys.length; i++) newData[reqKeys[i]] = req.body[reqKeys[i]];

//     res.locals["newData"] = newData;
//     next();
// }

// export const deleteRecordable = (req:Request, res:Response, next:NextFunction) => {
//     getSchema(res.locals.type).findByIdAndDelete(req.params.rid, (error:any) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         res.status(HTTP.OK).end();
//     })
// }