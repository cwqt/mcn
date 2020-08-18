import { Request, Response, NextFunction } from "express";
import { body, param, query } from "express-validator";
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
// import ApiKey from "../../classes/IoT/ApiKey.model";
import { IResLocals } from "../../mcnr";
import { paginate, capitalize } from "../Node.controller";
import DeviceProperty from "../../classes/IoT/DeviceProperty.model";

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
  assignProp: validate([
    body("assignableType")
      .notEmpty()
      .withMessage("Must provide assignable type")
      .isIn([NodeType.Farm, NodeType.Rack, NodeType.Crop])
      .withMessage("Not a valid assignable type"),
    body("assignableId")
      .notEmpty()
      .withMessage("Must provide assignable id")
      .isMongoId()
      .withMessage("Invalid UUID"),
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

export const setApiKey = async (req: Request): Promise<IApiKeyPrivate> => {
  return {} as IApiKeyPrivate;
};

export const readApiKey = async (req: Request): Promise<IApiKey> => {
  return {} as IApiKey;
};

export const updateApiKey = async (req: Request): Promise<IApiKey> => {
  return {} as IApiKey;
};

export const deleteApiKey = async (req: Request) => {};

export const assignProp = (propType: NodeType.Sensor | NodeType.State) => {
  return async (req: Request) => {
    const assignableNodeType: NodeType = req.body.assignableType;
    const assignableId: string = req.body.assignableId;

    const prop = DeviceProperty.read(req.params.id, propType);
    if (!prop) throw new ErrorHandler(HTTP.NotFound, `DeviceProperty does not exist`);

    const res = await cypher(
      `
      MATCH (a:${capitalize(assignableNodeType)} {_id:$aid})
      RETURN a
    `,
      {
        aid: assignableId,
      }
    );

    if (!res.records.length)
      throw new ErrorHandler(HTTP.NotFound, `${capitalize(assignableNodeType)} does not exist`);

    await cypher(
      ` MATCH (p:${capitalize(propType)} {_id:$pid})
        MATCH (a:${capitalize(assignableNodeType)} {_id:$aid})
        OPTIONAL MATCH (p)-[r:INTENDED_FOR]->()
        DELETE r
        CREATE (p)-[:INTENDED_FOR]->(a)
    `,
      {
        pid: req.params.id,
        aid: assignableId,
      }
    );
  };
};

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

  for (const [propType, deviceProp] of Object.entries(propMap)) {
    propMap[propType] = Object.keys(deviceProp).map((ref: string) => {
      return {
        _id: new Types.ObjectId().toHexString(),
        name: `${deviceProp[ref].type} ${propType}`,
        created_at: Date.now(),
        ref: ref,
        type: propType,
        description: "",
        value: null,
        measures: deviceProp[ref].type,
        data_format: deviceProp[ref].unit,
      };
    });
  }

  let d = await Device.create(
    req.session.user._id,
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
  return async (req: Request): Promise<IDeviceProperty<any>[]> => {
    let res = await cypher(
      ` MATCH (d:Device {_id:$did})
        MATCH (d)-->(p:${capitalize(node)})
        RETURN p`,
      {
        did: req.params.did,
      }
    );

    return res.records.map((r: Record) => DeviceProperty.reduce(r.get("p").properties));
  };
};

export const readPropertyData = (node: NodeType.Sensor | NodeType.State | NodeType.Metric) => {
  return async (req: Request) => {
    let results = await dbs.influx.query(`
      select * from iot
      order by time desc
      limit 10
    `);

    return results;
  };
};

//get most recent data across all device measurements
export const getStatus = async (req: Request) => {
  let res = await cypher(
    `
    MATCH (d:Device)
    MATCH (d)-[:HAS_PROPERTY]->(p)
    RETURN p
  `,
    {
      did: req.params.did,
    }
  );

  let m = res.records.map((x) => x.get("p").properties.measures);
  console.log(m);

  let r = await dbs.influx.query(`
    SELECT * FROM ${m.join(",")}
    WHERE creator='${NodeType.Device + "-" + req.params.did}'
    LIMIT 1
  `);
  console.log(r.groups());
  return r.groups();
};
