import { Request, Response } from "express";
import { Types }             from "mongoose";

import { HardwareInformation } from "../../common/types/hardware.types";
import { HTTP }              from '../../common/http';
import dbs, { cypher }       from '../../common/dbs';
import { HardwareDevice, SupportedHardware }    from "../../models/Hardware.model";
import { IPlant }            from '../../models/Plant.model';
import { IGarden }           from '../../models/Garden.model';
import { IRecordableStub }   from "../../models/Recordable.model";
import { ErrorHandler }      from "../../common/errorHandler";
import {
    IDeviceSensor,
    IDevice,
    DeviceState, 
    IDeviceState}            from "../../models/Device/Device.model";
import {
    IApiKey,
    IApiKeyPrivate }         from '../../models/Device/ApiKey.model';
import { 
    Measurement,
    IoTState,
    IoTMeasurement }         from "../../common/types/measurements.types";

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
    const hwInfo:HardwareDevice = HardwareInformation[<SupportedHardware>req.body.hardware_model];
    let device:IDevice = {
        _id:        Types.ObjectId().toHexString(),
        name:       req.body.name,
        images:     [],
        created_at: Date.now(),
        state:      DeviceState.UnVerified,
        measurement_count: 0,
        hardware_model: req.body.hardware_model,
        network_name: hwInfo.network_name
    }

    let sensors:IDeviceSensor[] = [];
    let metrics:IDeviceSensor[] = [];
    let states:IDeviceState[]   = [];

    sensors = Object.keys(hwInfo.sensors).map((s:Measurement) => {
        return {
            _id: Types.ObjectId().toHexString(),
            measures: hwInfo.sensors[s].type,
            unit: hwInfo.sensors[s].unit,
            name: hwInfo.sensors[s].type + " sensor",
            description: "",
            ref: s,
            value: undefined,
        } as IDeviceSensor
    })

    metrics = Object.keys(hwInfo.metrics).map((s:IoTMeasurement) => {
        return {
            _id: Types.ObjectId().toHexString(),
            measures: hwInfo.metrics[s].type,
            unit: hwInfo.metrics[s].unit,
            name: hwInfo.metrics[s].type + " metric",
            description: "",
            ref: s,
            value: undefined,
        } as IDeviceSensor
    })

    states = Object.keys(hwInfo.states).map((s:IoTState) => {
        return {
            _id: Types.ObjectId().toHexString(),
            state: hwInfo.states[s].type,
            type: hwInfo.states[s].unit,
            name: hwInfo.states[s].type + " state",
            description: "",
            ref: s,
            value: undefined,
        } as IDeviceState
    })

    console.log(sensors, states, metrics);

    let session = dbs.neo4j.session();
    let result;
    try {
        const txc = session.beginTransaction();
        result = await txc.run(`
            MATCH (u:User {_id:$uid})
            CREATE (d:Device $body)<-[:CREATED]-(u)
            return d
        `, {
            uid: req.params.uid,
            body: device,
        })

        await txc.run(`
            MATCH (d:Device {_id:$did})
            FOREACH (sensor in $sensors | CREATE (s:Sensor)<-[:HAS_SENSOR]-(d) SET s=sensor)
        `, { did: device._id, sensors: sensors })

        await txc.run(`
            MATCH (d:Device {_id:$did})
            FOREACH (metric in $metrics | CREATE (m:Metric)<-[:HAS_METRIC]-(d) SET m=metric);
        `, { did: device._id, metrics: metrics })

        await txc.run(`
            MATCH (d:Device {_id:$did})
            FOREACH (state in $states | CREATE (s:State)<-[:HAS_STATE]-(d) SET s=state);
        `, { did: device._id, states: states })

        await txc.commit();
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    let d = {
        ...result.records[0].get('d').properties,
        ...createDefaultMeta()
    }
    // d.measurement_count = d.measurement_count.toNumber();
    res.status(HTTP.Created).json(d);
}

export const updateDevice = async (req:Request, res:Response) => {

}

export const deleteDevice = async (req:Request, res:Response) => {
    
}

export const assignDeviceToRecordable = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (r {_id:$rid})
        WHERE r:Plant OR r:Garden
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
        MATCH (d:Device {_id:$did})
        WITH d,
            SIZE((d)<-[:REPOST_OF]-(:Post)) AS reposts,
            SIZE((d)<-[:REPLY_TO]-(:Post)) AS replies,
            SIZE((d)<-[:HEARTS]-(:User)) AS hearts

        WITH d, reposts, replies, hearts
        OPTIONAL MATCH (d)-[:HAS_KEY]->(k:ApiKey)

        WITH d, reposts, replies, hearts, k
        OPTIONAL MATCH (d)-[:MONITORS]->(r)
        WHERE r:Plant OR r:Garden

        RETURN d, r, k, hearts, replies, reposts,
            EXISTS ((:User {_id:$selfid})-[:HEARTS]->(d)) AS isHearting,
            EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(d)) AS hasReposted
    `, {
        did: req.params.did,
        selfid: req.session.user.id
    })

    let device = result.records[0].get('d')?.properties;
    device.measurement_count = device.measurement_count ? device.measurement_count.toNumber() : 0;
    let recordable:IPlant | IGarden = result.records[0].get('r')?.properties;
    let key:IApiKeyPrivate = result.records[0].get('k')?.properties;

    if(key) delete key.key;

    let data:IDevice = {
        ...device,
        state: getDeviceState(device),
        assigned_to: recordable || null,
        api_key: key as IApiKey || null,
        meta: {
            isHearting:  result.records[0].get('isHearting') ? true : false,
            hasReposted: result.records[0].get('hasReposted') ? true : false,
            hearts:      result.records[0].get('hearts').toNumber(),
            reposts:     result.records[0].get('reposts').toNumber(),
            replies:     result.records[0].get('replies').toNumber(),    
        },
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
    let session = dbs.neo4j.session();
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

export const readDeviceSensors = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (d:Device {_id:$did})
        OPTIONAL MATCH (d)-[:HAS_SENSOR]-(s:Sensor)
        RETURN d, collect(s) AS s
    `, {
        did: req.params.did
    })

    let states = result.records[0]?.get('s')?.map((x:any) => x.properties);
    return res.json(states ?? []);
}

export const readDeviceStates = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (d:Device {_id:$did})
        OPTIONAL MATCH (d)-[:HAS_STATE]-(s:State)
        RETURN d, collect(s) AS s
    `, {
        did: req.params.did
    })

    let states = result.records[0]?.get('s')?.map((x:any) => x.properties);
    return res.json(states ?? []);
}

export const readDeviceMetrics = async (req:Request, res:Response) => {
    let result = await cypher(`
        MATCH (d:Device {_id:$did})
        OPTIONAL MATCH (d)-[:HAS_METRIC]->(m:Metric)
        RETURN d, collect(m) AS m
    `, {
        did: req.params.did
    })

    let metrics = result.records[0]?.get('m')?.map((x:any) => x.properties);
    return res.json(metrics ?? []);    
}

const createDefaultMeta = () => {
    return {
        meta: {
            isHearting:  false,
            hasReposted: false,
            hearts:      0,
            reposts:     0,
            replies:     0 ,
        }
    }
}