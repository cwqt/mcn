import { Request, Response } from "express";
import { Model, model }      from "mongoose";
import mongoose              from 'mongoose';

import { IDevice }           from "../models/Device.model";
import { HTTP }              from '../common/http';
import { ErrorHandler }      from "../common/errorHandler";
import { n4j }               from '../common/neo4j';
import { MeasurementTypes }  from '../common/types/measurements.types';
import { IGarden }           from "../models/Garden.model";
import { IPlant }            from "../models/Plant.model";
import {
    IMeasurementModel,
    IMeasurement,
    MeasurementSchema, 
    RecorderTypes } from "../models/Measurement.model";

//each recordable has it's own collection denoted by it's _id
// db.collections[req.params.rid]. etc...

let cachedModels:{[index:string]:Model<IMeasurementModel>} = {}
const getModel = (recordable_id:string):Model<IMeasurementModel> => {
    if(!(recordable_id in Object.keys(cachedModels))) {
        cachedModels[recordable_id] = model<IMeasurementModel>("Measurement", MeasurementSchema, recordable_id);
    }
    console.log(cachedModels)
    return cachedModels[recordable_id];
}

export const createMeasurement = async (req:Request, res:Response) => {
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
            SET d.last_ping = $date
            RETURN d, r
        `, {
            did: req.params.did,
            date: Date.now()
        })

        let device:IDevice = result.records[0]?.get('d')?.properties;
        let recordable:IPlant | IGarden = result.records[0]?.get('r')?.properties;

        if(!device) throw new ErrorHandler(HTTP.NotFound, 'No such device exists');
        if(!recordable) throw new ErrorHandler(HTTP.NotFound, 'No such recordable assigned to this device');
        measurement.recordable_id = recordable._id;
    }

    let Measurement = getModel(measurement.recordable_id);
    try {
        let m:IMeasurementModel = await Measurement.create(measurement)
        if(!m) throw new ErrorHandler(HTTP.ServerError, "Failed to create measurement")
        res.status(HTTP.Created).json(m);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }
}

export const readAllMeasurements = async (req:Request, res:Response) => {
    let Measurement = getModel(req.params.rid);
    try {
        let ms:IMeasurementModel[] = await Measurement.find({recordable_id:req.params.rid}).select('-recordable_id')
        res.json(ms);
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }
}

export const deleteMeasurements = async (req:Request, res:Response) => {
    let Measurement = getModel(req.params.rid);
    try {
        let result = await Measurement.deleteMany(req.body);            
        console.log(result);
        res.status(HTTP.OK).end();
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)        
    }
}

export const getMeasurementTypes = (req:Request, res:Response) => {
    res.json(MeasurementTypes);
}

export const deleteMeasurementCollection = async (req:Request, res:Response) => {
    try {
        let result = await mongoose.connection.dropCollection(req.params.rid);
        res.status(HTTP.OK);
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

