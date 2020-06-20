import { Request, Response } from "express";
import { cypher } from "../../common/dbs";
import { IDeviceSensor } from "../../models/Device/Device.model";
import { Types } from "mongoose";
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";

export const createSensor = async (req:Request, res:Response) => {
    // let sensor:IDeviceSensor = {
    //     name: req.body.name,
    //     measures: req.body.measures,
    //     unit: req.body.unit,
    //     _id: Types.ObjectId().toHexString()
    // }

    // let result = await cypher(`
    //     MATCH (d:Device {_id: $did})
    //     CREATE (s:Sensor $body)<-[:HAS_SENSOR]-(d)
    //     RETURN s
    // `, {
    //     did: req.params.did,
    //     body: sensor
    // })

    // if(!result.records[0]?.get('s')) throw new ErrorHandler(HTTP.ServerError, "Could not create Sensor");

    // res.status(HTTP.Created).json(result.records[0].get('s').properties)
}

export const updateSensor = async (req:Request, res:Response) => {}

export const deleteSensor = async (req:Request, res:Response) => {}

export const removeSensorFromDevice = async (req:Request, res:Response) => {}