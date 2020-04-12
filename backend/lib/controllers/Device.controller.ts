import { Request, Response, NextFunction } from "express";

import { Device, IDeviceModel }     from "../models/Device.model";
import { HTTP }                     from '../common/http';
import { ErrorHandler }             from "../common/errorHandler";

export const readAllDevices = (req:Request, res:Response, next:NextFunction) => {
    Device.find({user_id: req.params.uid}, (error, devices:IDeviceModel[] | undefined) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error.message))
        res.json(devices);
    })
}

export const createDevice = (req:Request, res:Response, next:NextFunction) => {
    req.body["user_id"] = req.params.uid;

    Device.create(req.body, (error:any, device:IDeviceModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error.message))
        res.status(201).json(device);
    })
}

export const readDevice = (req:Request, res:Response, next:NextFunction) => {
    Device.findById(req.params.did, (error:any, device:IDeviceModel | undefined) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error.message));
        if(!device) return next(new ErrorHandler(HTTP.NotFound, "no such device"));
        res.json(device);
    })
}

export const updateDevice = (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    let allowedFields = [
        "user_id", "api_key_id", "recordable_id",
        "verified", "hardware_model", "software_version",
        "friendly_title", "recording"];
    
    let reqKeys = Object.keys(req.body);
    for(let i=0; i<reqKeys.length; i++) {
        if(!allowedFields.includes(reqKeys[i])) continue;
        newData[reqKeys[i]] = req.body[reqKeys[i]];
    }

    Device.findByIdAndUpdate(req.params.did, newData, {new:true, runValidators:true}, (error:any, device:IDeviceModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error))
        return res.json(device)
    })    
}

export const deleteDevice = (req:Request, res:Response, next:NextFunction) => {
    Device.findByIdAndDelete(req.params.did, (error) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.status(200).end();
    })
}
