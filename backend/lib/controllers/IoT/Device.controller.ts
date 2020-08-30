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
  INodeGraphItem,
  INodeGraph,
  INode,
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

export const assignManyProps = async (req: Request) => {
  // 1:1 mapping in req.body
  // state-1dhc8: farm-dy2nc
  // sensor-2cadl: rack-3odf
  await Promise.all(
    Object.entries(req.body).map(([prop, assignable]) => {
      let p = prop.split("-");
      let a = (<string>assignable).split("-");
      return assignProp(p[0] as NodeType.Sensor | NodeType.State, p[1], a[0] as NodeType, a[1]);
    })
  );

  return;
};

export const assignProp = (
  propType: NodeType.Sensor | NodeType.State,
  propId?: string,
  assignableType?: NodeType,
  assignableId?: string
) => {
  return async (req: Request) => {
    const assignableNodeType: NodeType = assignableType || req.body.assignableType;
    const assignableNodeId: string = assignableId || req.body.assignableId;

    const prop = DeviceProperty.read(propId || req.params.id, propType);
    if (!prop) throw new ErrorHandler(HTTP.NotFound, `DeviceProperty does not exist`);

    const res = await cypher(
      ` MATCH (a:${capitalize(assignableNodeType)} {_id:$aid})
        RETURN a`,
      { aid: assignableNodeId }
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
        aid: assignableNodeId,
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

export const readPropGraph = async (req: Request): Promise<INodeGraph> => {
  let graph: INodeGraph = {
    sources: {},
    data: [],
  };

  //https://stackoverflow.com/questions/21896382/neo4j-cypher-nested-collect
  const res = await cypher(
    ` MATCH (d:Device {_id:$did})
      OPTIONAL MATCH (d)-[:HAS_PROPERTY]->(p)
      WITH d, p
      OPTIONAL MATCH (p)-[:INTENDED_FOR]->(r)
      WHERE r IS NOT NULL
      WITH d,p,{name: r.name, _id:r._id, type: r.type} as recordables
      WITH d,{name: p.name, _id:p._id, type: p.type, recordables: collect(recordables)} as properties
      WITH {name: d.name, _id:d._id, properties: collect(properties)} as device
      RETURN device`,
    { did: req.params.did }
  );

  //insert root node to sources
  graph.sources[`${NodeType.Device}-${req.params.did}`] = {
    name: res.records[0].get("device").name,
  };

  // add all props / recordables into flat node array
  res.records[0].get("device").properties.forEach((p: any) => {
    if (!Object.keys(graph.sources).includes(`${p.type}-${p._id}`)) {
      graph.sources[`${p.type}-${p._id}`] = { name: p.name };
    }

    graph.data.push({
      from: `${NodeType.Device}-${req.params.did}`,
      to: `${p.type}-${p._id}`,
      custom: {
        relationship: "HAS_PROPERTY",
      },
    });

    p.recordables
      .filter((r: any) => r.type !== null)
      .forEach((r: any) => {
        if (!Object.keys(graph.sources).includes(`${r.type}-${r._id}`)) {
          graph.sources[`${r.type}-${r._id}`] = { name: r.name };
        }

        graph.data.push({
          from: `${p.type}-${p._id}`,
          to: `${r.type}-${r._id}`,
          custom: {
            relationship: "INTENDED_FOR",
          },
        });
      });
  });

  console.log(graph);

  return graph;
};
