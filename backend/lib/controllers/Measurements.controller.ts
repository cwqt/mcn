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
    IoTDataPacket,
    IMeasurement,
    RecorderType,
    MeasurementSchema } from "../models/Measurement.model";

import { RecordableType } from '../models/Recordable.model';

//each recordable/device has it's own collection denoted by it's type-_id
// e.g. device-8asvda87213..., plant-oqbdb30dhal...
let cachedModels:{[index:string]:Model<IMeasurementModel>} = {}
export const getModel = (type:RecordableType, _id:string):Model<IMeasurementModel> => {
    if(!(_id in Object.keys(cachedModels))) {
        cachedModels[_id] = model<IMeasurementModel>("Measurement", MeasurementSchema, `${type}-${_id}`);
    }
    console.log(cachedModels)
    return cachedModels[_id];
}

const createMeasurement = async (measurement:IMeasurement, type:RecordableType, _id:string) => {
    let Measurement = getModel(type, _id);
    try {
        let m:IMeasurementModel = await Measurement.create(measurement)
        if(!m) throw new ErrorHandler(HTTP.ServerError, "Failed to create measurement")
        return true;
    } catch(e) {
        return false;
    }
}

// ===============================================================================================================================

export const createMeasurementAsDevice = async (req:Request, res:Response) => {
    req.body = req.body as IoTDataPacket;

    let session = n4j.session();
    let result;
    try {
        //find devices' assigned recordable
        result = await session.run(`
            MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
            WHERE r:Plant OR r:Garden
            RETURN d, r
        `, {
            did: req.params.did,
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)   
    }

    let device:IDevice = result.records[0]?.get('d')?.properties;
    let recordable:IPlant | IGarden = result.records[0]?.get('r')?.properties;

    if(!device) throw new ErrorHandler(HTTP.NotFound, 'No such device exists');
    if(!recordable) throw new ErrorHandler(HTTP.NotFound, 'No such recordable assigned to this device');

    let recordable_measurement:IMeasurement = {
        data: req.body.recordable_data,
        recorder_type: RecorderType.Device,
        recorder_id: req.params.did,
        created_at: Date.now()
    };

    let device_measurement:IMeasurement = {
        //device made this measurement & is intended for itself
        // no need for recorder_id/recorder_type/recordable_id
        data: req.body.device_data,
        created_at: Date.now()
    }

    console.log(device_measurement)

    try {
        await Promise.all([
            createMeasurement(recordable_measurement, recordable.type, recordable._id),
            createMeasurement(device_measurement, RecordableType.Device, req.params.did)
        ])

        //already know device exists, so no trycatch
        await session.run(`
            MATCH (d:Device {_id:$did})
            SET d.last_ping = $date
            SET d.measurement_count = d.measurement_count + 1
            RETURN d
        `, {
            did: req.params.did,
            date: Date.now()
        })

        res.status(HTTP.Created).end();            
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}


export const createMeasurementAsUser = async (req:Request, res:Response) => {
    req.body = req.body as IoTDataPacket
    let measurement:IMeasurement = {
        data: req.body.recordable_data,
        recorder_type: RecorderType.User,
        recorder_id: req.params.uid,
        created_at: Date.now()
    };

    try {
        await createMeasurement(measurement, res.locals.recordable_type, req.params.rid);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}






export const readAllMeasurements = async (req:Request, res:Response) => {
    let Measurement = getModel(res.locals.recordable_type, req.params.rid);
    try {
        let ms:IMeasurementModel[] = await Measurement.find({recordable_id:req.params.rid}).select('-recordable_id')
        res.json(ms);
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }
}

export const deleteMeasurements = async (req:Request, res:Response) => {
    let Measurement = getModel(res.locals.recordable_type, req.params.rid);
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
        let result = await mongoose.connection.dropCollection(`${res.locals.recordable_type}-${req.params.rid}`);
        res.status(HTTP.OK);
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

