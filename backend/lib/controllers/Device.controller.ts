import { Request, Response } from "express";
import { Types }             from "mongoose";

import { HTTP }              from '../common/http';
import { ErrorHandler }      from "../common/errorHandler";
import { n4j, cypher }               from '../common/neo4j';

import { IPlant }            from '../models/Plant.model';
import { IGarden }           from '../models/Garden.model';
import { getModel }          from './Measurements.controller';
import { IRecordableStub, RecordableType }   from "../models/Recordable.model";
import { IMeasurementModel, RecorderType } from "../models/Measurement.model";
import {
    IDeviceStub,
    IDevice,
    DeviceState }            from "../models/Device.model";
import {
    IApiKey,
    IApiKeyPrivate }         from '../models/ApiKey.model';
import { ISensor } from "../models/Sensor.model";


export const getDeviceState = (device:IDevice):DeviceState => {
    if(device.last_ping == undefined) return DeviceState.UnVerified
    if(device.last_ping && device.measurement_count == 0) return DeviceState.Verified
    if(device.last_ping && device.measurement_count > 0) {
        let current_time = Date.now();
        if(current_time - device.last_ping > 86400*1000) {//1 day
            return DeviceState.InActive
        } else {
            return DeviceState.Active
        }
    }
}

export const createDevice = async (req:Request, res:Response) => {
    let device:IDevice = {
        _id:        Types.ObjectId().toHexString(),
        name:       req.body.name,
        images:     [],
        verified:   false,
        created_at: Date.now(),
        state:      DeviceState.UnVerified,
        measurement_count: 0,
        hardware_model: req.body.hardware_model,
    }

    let result = await cypher(`
        MATCH (u:User {_id:$uid})
        CREATE (d:Device $body)<-[:CREATED]-(u)
        return d
    `, {
        uid: req.params.uid,
        body: device
    })

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    let d = result.records[0].get('d').properties;
    d.measurement_count = d.measurement_count.toNumber();
    res.status(HTTP.Created).json(d);
}


export const assignDeviceToRecordable = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (r {_id:$rid}) WHERE r:Plant OR r:Garden
        MATCH (d:Device {_id:$did})
        MERGE (d)-[m:MONITORS]->(r)
        RETURN m
    `, {
        rid: req.params.rid,
        did: req.params.did,
    })

    res.status(HTTP.Created).end()
}

export const readDevice = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
        WHERE r:Plant OR r:Garden
        WITH d, r,
            SIZE((d)<-[:REPOST_OF]-(:Post)) AS reposts,
            SIZE((d)<-[:REPLY_TO]-(:Post)) AS replies,
            SIZE((d)<-[:HEARTS]-(:User)) AS hearts

        MATCH (d)-[:HAS_SENSOR]->(s:Sensor)
        OPTIONAL MATCH (d)-[:HAS_KEY]->(k:ApiKey)
        RETURN d,r,k,s, hearts, replies, reposts,
            EXISTS ((:User {_id:$selfid})-[:HEARTS]->(d)) AS isHearting,
            EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(d)) AS hasReposted
    `, {
        did: req.params.did,
        selfid: req.session.user.id
    })

    let device = result.records[0].get('d')?.properties;
    device.measurement_count = device.measurement_count.toNumber();
    let recordable:IPlant | IGarden = result.records[0].get('r')?.properties;
    let key:IApiKeyPrivate = result.records[0].get('k')?.properties;
    let sensors:ISensor[] = result.records[0].map((record:any) => record.get('s').properties);

    if(key) delete key.key;

    let data:IDevice = {
        ...device,
        state: getDeviceState(device),
        assigned_to: recordable || undefined,
        api_key: key as IApiKey || undefined,
        meta: {
            isHearting:  result.records[0].get('isHearting') ? true : false,
            hasReposted: result.records[0].get('hasReposted') ? true : false,
            hearts:      result.records[0].get('hearts').toNumber(),
            reposts:     result.records[0].get('reposts').toNumber(),
            replies:     result.records[0].get('replies').toNumber(),    
        }    
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

    res.json(data);
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

export const pingDevice = async (req:Request, res:Response) => {
    await cypher(`
        MATCH (d:Device {_id:$did})
        SET d.last_ping = $time
        RETURN d
    `, {
        did: req.params.did,
        time: Date.now()
    })    

    res.status(HTTP.OK).end()
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