import { Request, Response } from "express";
import { Types }             from "mongoose";

import { HTTP }              from '../common/http';
import { ErrorHandler }      from "../common/errorHandler";
import { n4j }               from '../common/neo4j';

import { IPlant }            from '../models/Plant.model';
import { IGarden }           from '../models/Garden.model';
import { getModel }          from './Measurements.controller';
import { IRecordableStub }   from "../models/Recordable.model";
import { IMeasurementModel } from "../models/Measurement.model";
import {
    IDeviceStub,
    IDevice,
    IDeviceCollated,
    IDeviceMeta }            from "../models/Device.model";
import {
    IApiKey,
    IApiKeyPrivate }         from '../models/ApiKey.model';

export const createDevice = async (req:Request, res:Response) => {
    let session = n4j.session();
    let device:IDevice = {
        _id:        Types.ObjectId().toHexString(),
        name:       req.body.name,
        images:     [],
        verified:   false,
        created_at: Date.now(),
    }

    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})
            CREATE (d:Device $body)<-[:CREATED]-(u)
            return d
        `, {
            uid: req.params.uid,
            body: device
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    res.status(HTTP.Created).json(result.records[0].get('d').properties);
}


export const assignDeviceToRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    
    let result;
    try {
        result = await session.run(`
            MATCH (r {_id:$rid}) WHERE r:Plant OR r:Garden
            MATCH (d:Device {_id:$did})
            MERGE (d)-[m:MONITORS]->(r)
            RETURN m
        `, {
            rid: req.params.rid,
            did: req.params.did,
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    res.status(HTTP.Created).end()
}

export const readAllDevices = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (d:Device)<-[:CREATED]-(:User {_id:$uid})
            RETURN d
        `, {
            uid:req.params.uid
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    let recordables:IDeviceStub[] = result.records.map((record:any) => {
        let r = record.get('d').properties;
        return {
            _id: r._id,
            name: r.name,
            verified: r.verified,
            created_at: r.created_at,
            last_ping: r.last_ping
        } as IDeviceStub
    })

    res.json(recordables)
}

export const readDevice = async (req:Request, res:Response) => {
    let data = await readDeviceMeta(req.params.did) as IDeviceCollated;
    res.status(HTTP.Created).json(data);
}

export const readLatestMeasurementFromDevice = async (req:Request, res:Response) => {
    let recordable:IPlant | IGarden;
    try {
        recordable = await getAssignedRecordable(req.params.did);        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }

    let data:IMeasurementModel;
    try {
        data = await getModel(recordable._id)
            .findOne({recordable_id: recordable._id})
            .sort({'created_at': -1 })
            .limit(1);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }

    res.json(data)
}

// export const updateDevice = (req:Request, res:Response, next:NextFunction) => {
//     var newData:any = {}
//     let allowedFields = [
//         "user_id", "api_key_id", "recordable_id",
//         "verified", "hardware_model", "software_version",
//         "friendly_title", "recording"];
    
//     let reqKeys = Object.keys(req.body);
//     for(let i=0; i<reqKeys.length; i++) {
//         if(!allowedFields.includes(reqKeys[i])) continue;
//         newData[reqKeys[i]] = req.body[reqKeys[i]];
//     }

//     Device.findByIdAndUpdate(req.params.did, newData, {new:true, runValidators:true}, (error:any, device:IDeviceModel) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error))
//         return res.json(device)
//     })    
// }

// export const deleteDevice = (req:Request, res:Response, next:NextFunction) => {
//     Device.findByIdAndDelete(req.params.did, (error) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error));
//         res.status(200).end();
//     })
// }

// export const pingDevice = (req:Request, res:Response, next:NextFunction) => {
//     Device.findByIdAndUpdate(req.params.did, {"last_ping": new Date(), "verified": true}, {new: true}, (error, device:IDeviceModel) => {
//         if (error) return next(new ErrorHandler(HTTP.ServerError));
//         res.status(HTTP.OK).end();
//     });
// }

const readDeviceMeta = async (device_id:string):Promise<IDeviceMeta> => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
            WHERE r:Plant OR r:GARDEN
            OPTIONAL MATCH (d)-[:HAS_KEY]->(k:ApiKey)
            RETURN d, r, k
        `, {
            did: device_id
        })
    } catch (e) {
        throw new Error(e);
    } finally {
        session.close();
    }

    let device:IDevice = result.records[0].get('d')?.properties;
    let recordable:IPlant | IGarden = result.records[0].get('r')?.properties;
    let key:IApiKeyPrivate = result.records[0].get('k')?.properties;
    if(key) delete key.key;

    let data:IDeviceMeta = {
        ...device,
        assigned_to: recordable || undefined,
        api_key: key as IApiKey || undefined
    };

    if(recordable) {
        data.assigned_to = {
            _id: recordable._id,
            name: recordable.name,
            thumbnail: recordable.thumbnail,
            created_at: recordable.created_at,        
            type: recordable.type
        } as IRecordableStub
    }

    return data;
}

const getAssignedRecordable = async (device_id:string):Promise<IPlant | IGarden> => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
            WHERE r:Plant OR r:Garden
            RETURN r
        `, {
            did: device_id
        })     
    } catch(e) {
        throw new Error(e)
    }

    if(!result.records.length) throw new Error('Not recordable assigned to this device')
    return result.records[0].get('r').properties;
}