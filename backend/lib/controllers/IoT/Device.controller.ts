import { Request, Response, NextFunction } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";

import { HTTP } from "../../common/http";
import dbs, { cypher } from "../../common/dbs";
import { ErrorHandler } from "../../common/errorHandler";
import { Types } from "mongoose";

import { Record } from "neo4j-driver";

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
  IDeviceProperty,
  DataModel,
  Paginated,
} from "@cxss/interfaces";
import Device from "../../classes/IoT/Device.model";
import { IResLocals } from "../../mcnr";
import { paginate } from "../Node.controller";

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

export const readAllDevices = async (
  req: Request,
  next: NextFunction,
  locals: IResLocals
): Promise<Paginated<IDeviceStub>> => {
  const res = await cypher(
    ` MATCH (d:Device)
      WITH d, count(d) as total
      RETURN d{._id}, total
      SKIP toInteger($skip) LIMIT toInteger($limit)`,
    {
      skip: locals.pagination.page * locals.pagination.per_page,
      limit: locals.pagination.per_page,
    }
  );

  console.log(res.records);

  let devices = await Promise.all(
    res.records.map((r: Record) => Device.read<IDeviceStub>(r.get("d")._id, DataModel.Stub))
  );

  return paginate(
    NodeType.Device,
    devices,
    res.records[0].get("total").toNumber(),
    locals.pagination.per_page
  );
};

export const setApiKey = async (req: Request) => {};
export const readApiKey = async (req: Request) => {};
export const updateApiKey = async (req: Request) => {};
export const deleteApiKey = async (req: Request) => {};
export const assignDevice = async (req: Request) => {};

export const createDevice = async (req: Request, next: NextFunction): Promise<IDevice> => {
  const hwInfo: HardwareDevice = HardwareInformation[<SupportedHardware>req.body.hardware_model];

  const data: IDeviceStub = {
    _id: new Types.ObjectId().toHexString(),
    name: req.body.name,
    hardware_model: req.body.hardware_model,
    created_at: Date.now(),
    state: DeviceStateType.UnVerified,
    network_name: hwInfo.network_name,
    type: NodeType.Device,
  };

  const propMap: { [index: string]: any } = {
    [NodeType.Sensor]: hwInfo.sensors,
    [NodeType.State]: hwInfo.states,
    [NodeType.Metric]: hwInfo.metrics,
  };

  for (const [propType, deviceProps] of Object.entries(propMap)) {
    propMap[propType] = Object.keys(deviceProps).map((ref: string) => {
      return {
        _id: new Types.ObjectId().toHexString(),
        name: `${hwInfo.sensors[ref].type} ${propType}`,
        created_at: Date.now(),
        ref: ref,
        type: propType,
        description: "",
        value: null,
        measures: hwInfo.sensors[ref].type,
        data_format: hwInfo.sensors[ref].unit,
      };
    });
  }

  let d = await Device.create(
    req.session.user.id,
    data,
    propMap[NodeType.State],
    propMap[NodeType.Sensor],
    propMap[NodeType.Sensor]
  );

  return d;
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

export const readDevice = async (req: Request): Promise<IDevice> => {
  return await Device.read<IDevice>(req.params.did, DataModel.Full);
};

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

export const readProperties = (node: NodeType.Sensor | NodeType.State | NodeType.Metric) => {
  return async (req: Request) => {};
};
// export const readDeviceProperties = async (req: Request, res: Response) => {
//   let result = await cypher(
//     `
//         MATCH (d:Device {_id: $did})
//         OPTIONAL MATCH (d)-->(x:${res.locals.node_type})
//         RETURN x
//     `,
//     {
//       did: req.params.did,
//     }
//   );

//   let props = result.records.map((n: any) => n.get("x").properties);
//   return res.json(props ?? []);
// };

export const readPropertyData = (node: NodeType.Sensor | NodeType.State | NodeType.Metric) => {
  return async (req: Request) => {};
};
// export const readDevicePropertyData = async (req: Request, res: Response) => {
//   let results = await dbs.influx.query(`
//     select * from iot
//     order by time desc
//     limit 10
//   `);

//   res.json(results);
// };
