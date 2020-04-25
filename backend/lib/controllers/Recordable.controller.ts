import { Request, Response, NextFunction }    from "express"
const { body } = require('express-validator');

import { Recordable, RecordableTypes }  from "../models/Recordable.model"
import { validate }                     from "../common/validate";
import { Plant, IPlantModel }           from "../models/Plant.model";
import { Garden, IGardenModel }         from "../models/Garden.model";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { Model } from "mongoose";

const getSchema = (recordable_type:string):Model<any> => {
    switch(recordable_type) {
        case RecordableTypes.Plant:     return Plant;
        case RecordableTypes.Garden:    return Garden;
    }
}

export const createRecordable = (req:Request, res:Response, next:NextFunction) => {
    validate([body('name').not().isEmpty().trim()])(req, res, () => {
        ((req:Request, res:Response, next:NextFunction) => {
            //should really use transactions
            req.body["type"]    = res.locals.type;
            next();    
        })(req, res, next);
    });
}

// export const readAllRecordables = (req:Request, res:Response, next:NextFunction) => {
//     let query = res.locals.query || {}
//     query["user_id"]  = req.params.uid;

//     getSchema(res.locals.type).find(query, (error:any, recordables:IPlantModel[] | IGardenModel[]) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         res.json(recordables);
//     })
// }

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