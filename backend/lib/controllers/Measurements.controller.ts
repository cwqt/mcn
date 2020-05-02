import { Request, Response, NextFunction, request } from "express";

import { IDevice }     from "../models/Device.model";
import { HTTP }                     from '../common/http';
import { ErrorHandler }             from "../common/errorHandler";
import { n4j } from '../common/neo4j';
import { Types } from "mongoose";
import { IMeasurement } from "../models/Measurement.model";

export const createMeasurement = async (req:Request, res:Response) => {
    // Measurement.create()
}

export const readMeasurements = async (req:Request, res:Response, next:NextFunction) => {
    // Measurement.find({}, (err, measurements) => {
    //     res.json(measurements);
    // })
}