import { Request, Response, NextFunction } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";

import { HTTP } from "../../common/http";
import dbs, { cypher } from "../../common/dbs";
import { ErrorHandler } from "../../common/errorHandler";

import {
  IDevice,
  DeviceStateType,
  IApiKey,
  IApiKeyPrivate,
  HardwareDevice,
  SupportedHardware,
  HardwareInformation,
  NodeType,
  IDeviceStub,
} from "@cxss/interfaces";
import { Device } from "../../classes/IoT/Device.model";
import { DeviceProperty } from "../../classes/IoT/DeviceProperty.model";

export const validators = {
  createDevice: validate([
    body("name").not().isEmpty().trim().withMessage("device must have friendly name"),
    body("hardware_model")
      .not()
      .isEmpty()
      .withMessage("Must have hardware model")
      .custom((model: string, { req }: any) => {
        if (!Object.keys(HardwareInformation).includes(model))
          throw new Error("Un-supported hardware model");
        return true;
      }),
  ]),
  assignDevice: validate([
    param("rid").isMongoId().trim().withMessage("invalid recordable id to assign to"),
  ]),
  setApiKey: validate([
    body("name").not().isEmpty().trim().withMessage("device name must be named"),
  ]),
};

export const readAllDevices = async (req: Request): Promise<IDeviceStub[]> => {
  return [];
};

export const setApiKey = async (req: Request) => {};
export const readApiKey = async (req: Request) => {};
export const updateApiKey = async (req: Request) => {};
export const deleteApiKey = async (req: Request) => {};
export const assignDevice = async (req: Request) => {};

export const readProperties = (node: NodeType.Sensor | NodeType.State | NodeType.Metric) => {
  return async (req: Request) => {};
};

export const readPropertyData = (node: NodeType.Sensor | NodeType.State | NodeType.Metric) => {
  return async (req: Request) => {};
};

export const createDevice = async (req: Request, next: NextFunction): Promise<IDevice> => {
  const hwInfo: HardwareDevice = HardwareInformation[<SupportedHardware>req.body.hardware_model];
  let device = new Device(req.body.name, req.body.hardware_model);

  let sensors: DeviceProperty<NodeType.Sensor>[] = Object.keys(hwInfo.sensors).map(
    (ref: string) => new DeviceProperty(NodeType.Sensor, ref, hwInfo.sensors)
  );

  let metrics: DeviceProperty<NodeType.Metric>[] = Object.keys(hwInfo.metrics).map(
    (ref: string) => new DeviceProperty(NodeType.Metric, ref, hwInfo.metrics)
  );

  let states: DeviceProperty<NodeType.State>[] = Object.keys(hwInfo.states).map(
    (ref: string) => new DeviceProperty(NodeType.State, ref, hwInfo.states)
  );

  let session = dbs.neo4j.session();
  let result;
  try {
    const txc = session.beginTransaction();
    console.log(req.session, device.toFull());

    result = await txc.run(
      `
            MATCH (u:User {_id:$uid})
            CREATE (d:Device $body)<-[:CREATED]-(u)
            return d
        `,
      {
        uid: req.session.user._id,
        body: device.toFull(),
      }
    );

    await txc.run(
      `
            MATCH (d:Device {_id:$did})
            FOREACH (sensor in $sensors | CREATE (s:Sensor)<-[:HAS_SENSOR]-(d) SET s=sensor)
        `,
      { did: device._id, sensors: sensors.map((s) => s.toFull()) }
    );

    await txc.run(
      `
            MATCH (d:Device {_id:$did})
            FOREACH (metric in $metrics | CREATE (m:Metric)<-[:HAS_METRIC]-(d) SET m=metric);
        `,
      { did: device._id, metrics: metrics.map((m) => m.toFull()) }
    );

    await txc.run(
      `
            MATCH (d:Device {_id:$did})
            FOREACH (state in $states | CREATE (s:State)<-[:HAS_STATE]-(d) SET s=state);
        `,
      { did: device._id, states: states.map((s) => s.toFull()) }
    );

    await txc.commit();
  } catch (e) {
    next(new ErrorHandler(HTTP.ServerError, e));
  } finally {
    await session.close();
  }

  if (!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create Device");
  return result.records[0].get("d").properties as IDevice;
};

export const updateDevice = async (req: Request): Promise<IDevice> => {
  return {} as IDevice;
};

export const deleteDevice = async (req: Request) => {};

export const assignDeviceToRecordable = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (r {_id:$rid})
        WHERE r:Plant OR r:Garden
        MATCH (d:Device {_id:$did})
        MERGE (d)-[m:MONITORS]->(r)
        RETURN m
    `,
    {
      rid: req.params.rid,
      did: req.params.did,
    }
  );

  res.status(HTTP.Created).end();
};

export const readDevice = async (req: Request) => {
  let result = await cypher(
    `
        MATCH (d:Device {_id:$did})
        OPTIONAL MATCH (d)-[:HAS_KEY]->(k:ApiKey)
        RETURN d, r, k, hearts, replies, reposts,
    `,
    {
      did: req.params.did,
      selfid: req.session.user.id,
    }
  );

  let device = result.records[0].get("d")?.properties;
  // device.measurement_count = device.measurement_count
  //   ? device.measurement_count.toNumber()
  //   : 0;

  device.measurement_count = 0;
  let key: IApiKeyPrivate = result.records[0].get("k")?.properties;

  if (key) delete key.key;

  let data: IDevice = {
    ...device,
    state: getDeviceState(device),
    api_key: (key as IApiKey) || null,
  };

  return data;
};

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

export const pingDevice = async (req: Request) => {
  await cypher(
    `
        MATCH (d:Device {_id:$did})
        SET d.last_ping = $time
        RETURN d
    `,
    {
      did: req.params.did,
      time: Date.now(),
    }
  );

  return;
};

export const readDeviceProperties = async (req: Request, res: Response) => {
  let result = await cypher(
    `
        MATCH (d:Device {_id: $did})
        OPTIONAL MATCH (d)-->(x:${res.locals.node_type})
        RETURN x
    `,
    {
      did: req.params.did,
    }
  );

  let props = result.records.map((n: any) => n.get("x").properties);
  return res.json(props ?? []);
};

export const readDevicePropertyData = async (req: Request, res: Response) => {
  let results = await dbs.influx.query(`
    select * from iot
    order by time desc
    limit 10
  `);

  res.json(results);
};
