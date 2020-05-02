import { Request, Response, NextFunction, request } from "express";

import { IDevice }     from "../models/Device.model";
import { HTTP }                     from '../common/http';
import { ErrorHandler }             from "../common/errorHandler";
import { Types } from "mongoose";

export const createDevice = async (req:Request, res:Response) => {
    // req.body["_id"] = new Types.ObjectId().toHexString();

    // let result = await neode.instance.cypher(`
    //     MATCH (u:User {_id:$uid})
    //     CREATE (d:Device $body)<-[:CREATED]-(u)
    //     return d
    // `, {
    //     uid: req.params.uid,
    //     body: req.body
    // })

    // if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    // res.status(HTTP.Created).json(result.records[0].get('d').properties);
}


export const assignDeviceToRecordable = async (req:Request, res:Response) => {
    // let result;
    // try {
    //     result = await neode.instance.cypher(`
    //         MATCH (r {_id:$rid}) WHERE r:Plant OR r:Garden
    //         MATCH (d:Device {_id:$did})
    //         MERGE (d)-[m:MONITORS]->(r)
    //         RETURN m
    //     `, {
    //         rid: req.params.rid,
    //         did: req.params.did,
    //     })
    // } catch(e) { 
    //     console.log(e)
    // }

    // if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    // res.status(HTTP.Created).end()
}


export const readAllDevices = async (req:Request, res:Response, next:NextFunction) => {
    // let result = await neode.instance.cypher(`
    //     MATCH (d:Device)<-[:CREATED]-(:User {_id:$uid})
    //     RETURN d
    // `, {
    //     uid:req.params.uid
    // })

    // let recordables = result.records.map(recordable => recordable.get('d').properties)
    // res.json(recordables)
}

export const readDevice = async (req:Request, res:Response) => {
//     let result = await neode.instance.cypher(`
//         MATCH (d:Device {_id:$did})
//         RETURN d
//     `, {
//         did:req.params.did
//     })

//     if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
//     res.status(HTTP.Created).json(result.records[0].get('d').properties);
// }

// export const createDevice = (req:Request, res:Response, next:NextFunction) => {
//     req.body["user_id"] = req.params.uid;

//     Device.create(req.body, (error:any, device:IDeviceModel) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error.message))
//         res.status(201).json(device);
//     })
// }

// export const readDevice = (req:Request, res:Response, next:NextFunction) => {
//     Device.findById(req.params.did, (error:any, device:IDeviceModel | undefined) => {
//         if(error) return next(new ErrorHandler(HTTP.ServerError, error.message));
//         if(!device) return next(new ErrorHandler(HTTP.NotFound, "no such device"));
//         res.json(device);
//     })
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