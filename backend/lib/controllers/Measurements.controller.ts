import { Request, Response, NextFunction, request } from "express";

import { Device, IDeviceModel }     from "../models/Device.model";
import { HTTP }                     from '../common/http';
import { ErrorHandler }             from "../common/errorHandler";
import neode from '../common/neo4j';
import { Types } from "mongoose";
import { Measurement } from "../models/Measurement.model";

export const createMeasurement = async (req:Request, res:Response) => {
    // Measurement.create()
}

export const readMeasurements = async (req:Request, res:Response, next:NextFunction) => {
    // Measurement.find({}, (err, measurements) => {
    //     res.json(measurements);
    // })
}