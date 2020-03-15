import bcrypt                   from "bcrypt"
import { Request, Response }    from "express"
import { Recordable, RecordableTypes } from "../models/Recordable.model"
const { validationResult }      = require('express-validator');

export const readAllRecordables = (req:Request, res:Response) => {}
export const readRecordable     = (req:Request, res:Response) => {}
export const createRecordable   = (req:Request, res:Response) => {}
export const updateRecordable   = (req:Request, res:Response) => {}
export const deleteRecordable   = (req:Request, res:Response) => {}

// Garden specific
export const addPlantToGarden       = (req:Request, res:Response) => {}
export const deletePlantFromGarden  = (req:Request, res:Response) => {}
