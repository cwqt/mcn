import { Request, Response }    from "express";
import { Types }                from "mongoose";

import { IDevice }      from "../models/Device.model";
import { HTTP }         from '../common/http';
import { ErrorHandler } from "../common/errorHandler";
import { IApiKey, IApiKeyPrivate }      from '../models/ApiKey.model';
import { IPlant }       from '../models/Plant.model';
import { IGarden }      from '../models/Garden.model';
import { n4j }          from '../common/neo4j';

import { getModel }        from './Measurements.controller';
import { IRecordableStub } from "..//models/Recordable.model";

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

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
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


    let recordables = result.records.map((record:any) => record.get('d').properties)
    res.json(recordables)
}

export const readDevice = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        //get specific info
        // Device id:5eadbb819964c53de2c0bc63
        // Api key id:5eadbb819964c53de2c0bc63
        // Created:1588444033955
        // Software version:—
        // Hardware model:—
        // Total data points:103
        // Recording:temperature, humidity, light level, water level
        // Units: c, %, lux, —
        // Assigned to: Plant/Garden

        result = await session.run(`
            MATCH (d:Device {_id:$did})
            OPTIONAL MATCH (d)-[:HAS_KEY]->(k:ApiKey)
            OPTIONAL MATCH (d)-[:MONITORS]->(r)
            WHERE r:Plant OR r:Garden
            RETURN d, k, r
        `, {
            did:req.params.did
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);

    let device:IDevice = result.records[0].get('d')?.properties;
    let key:IApiKeyPrivate = result.records[0].get('k')?.properties;
    if(key) delete key.key;
    let recordable:IPlant | IGarden = result.records[0].get('r')?.properties;

    let data:IDevice = {
        ...device,
        api_key: key as IApiKey,
    }

    if(recordable) {
        data.assigned_to = {
            _id: recordable._id,
            name: recordable.name,
            thumbnail: recordable.thumbnail,
            created_at: recordable.created_at,        
        } as IRecordableStub

        //get latest measurement, if any
        data.latest_data = await getModel(recordable._id)
            .findOne({recordable_id:recordable._id})
            .sort({'created_at': -1 })
            .limit(1);
    }

    res.status(HTTP.Created).json(data);
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