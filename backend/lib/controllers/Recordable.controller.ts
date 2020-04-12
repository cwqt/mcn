import { Request, Response, NextFunction }    from "express"
const { body } = require('express-validator');

import { Recordable, RecordableTypes }  from "../models/Recordable.model"
import { validate }                     from "../common/validate";
import { Plant, IPlantModel }           from "../models/Plant.model";
import { Garden, IGardenModel }         from "../models/Garden.model";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";

// export const readAllRecordables = (req:Request, res:Response) => {}
// export const readRecordable     = (req:Request, res:Response) => {}
// export const createRecordable   = (req:Request, res:Response) => {}
// export const updateRecordable   = (req:Request, res:Response) => {}
// export const deleteRecordable   = (req:Request, res:Response) => {}

// // Garden specific
// export const addPlantToGarden       = (req:Request, res:Response) => {}
// export const deletePlantFromGarden  = (req:Request, res:Response) => {}


const getSchema = (recordable_type:string) => {
    switch(recordable_type) {
        case RecordableTypes.Plant:     return Plant;
        case RecordableTypes.Garden:    return Garden;
    }
}

export const createRecordable = (req:Request, res:Response, next:NextFunction) => {
    validate([body('name').not().isEmpty().trim()])(req, res, () => {
        ((req:Request, res:Response, next:NextFunction) => {
            req.body["user_id"] = req.params.uid;
            next();
        })(req,res,next);
    });
}

