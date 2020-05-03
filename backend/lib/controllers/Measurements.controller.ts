import { Request, Response, NextFunction, request } from "express";
import { Document, Schema, Model, model, Types} from "mongoose";

import { IDevice }     from "../models/Device.model";
import { HTTP }                     from '../common/http';
import { ErrorHandler }             from "../common/errorHandler";
import { n4j } from '../common/neo4j';
import { MeasurementTypes } from '../common/types/measurements.types';
import {
    IMeasurementModel,
    IMeasurement,
    MeasurementSchema, 
    RecorderTypes} from "../models/Measurement.model";

export const createMeasurement = async (req:Request, res:Response) => {
    //todo: catch err for non-existend recordable
    let measurement:IMeasurement = {
        measurements: req.body,
        recordable_id: req.params.rid || undefined,
        recorder_type: res.locals.type,
        recorder_id: req.params.did || req.params.uid
    };

    if(res.locals.type == RecorderTypes.Device) {
        //find linked recordable
        let session = n4j.session();
        let result = await session.run(`
            MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
            WHERE r:Plant OR r:Garden
            RETURN d, r
        `, {
            did: req.params.did
        })

        let device = result.records[0]?.get('d')?.properties;
        let recordable = result.records[0]?.get('r')?.properties;

        if(!device) throw new ErrorHandler(HTTP.NotFound, 'No such device exists');
        if(!recordable) throw new ErrorHandler(HTTP.NotFound, 'No such recordable assigned to this device');
        measurement.recordable_id = recordable._id;
    }

    let Measurement:Model<IMeasurementModel> = model<IMeasurementModel>("Measurement", MeasurementSchema, measurement.recordable_id);
    try {
        let m:IMeasurementModel = await Measurement.create(measurement)
        if(!m) throw new ErrorHandler(HTTP.ServerError, "Failed to create measurement")
        res.status(201).json(m);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }
}

export const readMeasurements = async (req:Request, res:Response) => {
    let Measurement:Model<IMeasurementModel> = model<IMeasurementModel>("Measurement", MeasurementSchema, req.params.rid);
    try {
        let ms:IMeasurementModel[] = await Measurement.find({})
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }
}

export const deleteMeasurement = (req:Request, res:Response) => {

}

export const getMeasurementTypes = (req:Request, res:Response) => {
    res.json(MeasurementTypes);
}