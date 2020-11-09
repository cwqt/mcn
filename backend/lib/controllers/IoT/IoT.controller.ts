import { Request, Response } from "express";
import { body, param, query, Meta } from "express-validator";
import { validate } from "../../common/validate";
import dbs, { cypher } from "../../common/dbs";
import convert from "convert-units";

import {
  NodeType,
  HardwareInformation,
  IDeviceStub,
  SupportedHardware,
  Measurement,
  IoTMeasurement,
  IoTState,
  IMeasurement,
  Unit,
  NonConvertableUnits,
  Type,
  IRecordable,
  DataModel,
  IRecordableStub,
} from "@cxss/interfaces";

import { Types } from "mongoose";
import { Record } from "neo4j-driver";
import Device from "../../classes/IoT/Device.model";
import { uploadImageToS3 } from "../../common/storage";
import Influx from "influx";
import {
  IAggregateResponseGroup,
  IAggregateRequestGroup,
  IAggregateResponse,
  Sources,
  Properties,
  IAggregateAxis,
} from "@cxss/interfaces/dist/IoT/Aggregation.model";
import RecordableModel from "../../classes/Hydroponics/Recordable.model";
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";
import { readRack } from "../Hydroponics/Rack.controller";

let devicePropMap: { [index in SupportedHardware]?: string[] } = {};
Object.entries(HardwareInformation).forEach(([model, value]) => {
  devicePropMap[model as SupportedHardware] = [
    ...Object.keys(value.sensors),
    ...Object.keys(value.states),
    ...Object.keys(value.metrics),
  ];
});

const allRecordables: string[] = [
  ...Object.values(Measurement),
  ...Object.values(IoTMeasurement),
  ...Object.values(IoTState),
];

export const validators = {
  createMeasurementAsUser: validate([
    body("name").not().isEmpty().trim().withMessage("Farm must have a name"),
  ]),
  createMeasurementAsDevice: validate([
    body().custom(async (body: { [index: string]: number | boolean | string }, meta: Meta) => {
      //Verify device actually exists
      const device: IDeviceStub = await Device.read<IDeviceStub>(meta.req.params.did);
      if (!device) throw new Error(`Device ${meta.req.params.did} does not exist`);

      //Got a ping, regardless of if data is valid
      await Device.update(device._id, { last_ping: Date.now() });

      //Verify all body refs are in this device's properties
      for (let i = 0; i < Object.keys(body).length; i++) {
        if (!devicePropMap[device.hardware_model].includes(Object.keys(body)[i])) {
          throw new Error(`Invalid refs in body for device model`);
        }
      }

      meta.req.device = device;
    }),
  ]),
  getMeasurements: validate([
    query("measurements").custom((v: string[], meta: Meta) => {
      const m = v[0];
      if (!m) throw new Error("Must have measurement(s)");
      const measurements = m.split(",");
      if (!measurements.every((m) => allRecordables.includes(m)))
        throw new Error(`Invalid measurement type provided`);
      return true;
    }),
    query("property", () => {
      (v: string) => {
        if (v) {
          const s = v.split("-") as [NodeType, string];
          if (s.length !== 2) throw new Error(`Not of the form: node-uid`);
          if (![NodeType.Sensor, NodeType.State, NodeType.Metric, NodeType.Device].includes(s[0]))
            throw new Error(`Not a valid node type`);
          if (!Types.ObjectId.isValid(s[1])) throw new Error("Not a valid id");
        }
        return true;
      };
    }),
    query(["creator", "intention"]).custom((v: string) => {
      if (v) {
        const s = v.split("-") as [NodeType, string];
        if (s.length !== 2) throw new Error(`Not of the form: node-uid`);
        if (![NodeType.Farm, NodeType.Rack, NodeType.Crop, NodeType.Device].includes(s[0]))
          throw new Error(`Not a valid node type`);
        if (!Types.ObjectId.isValid(s[1])) throw new Error("Not a valid id");
      }
      return true;
    }),
    query("start_date")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Require measurement start date")
      .isISO8601()
      .withMessage("Invalid date format"),
    query("end_date").optional().isISO8601().withMessage("Invalid date format"),
  ]),
};

// ===============================================================================================================================

export const getAggregateDataCount = async (req:Request):Promise<number> => {
  const data = await getAggregateData(req);
  // return data.axes.reduce((acc, curr) => {
  //   curr.aggregation_points.forEach(p => {
  //     Object.values(p.sources).forEach(s => acc += s.values.length);
  //   })
  //   return acc;
  // }, 0);
  return 0;
}

export const getAggregateData = async (req: Request): Promise<IAggregateResponseGroup> => {
  const body: IAggregateRequestGroup = req.body;
  let data: IAggregateResponseGroup = {
    sources: {},
    responses: [],
  };

  let sources: string[] = [];// all sources by id

  // for(let request of body.requests) {
  //   let resAxis:IAggregateAxis<IAggregateResponse> = {
  //     title: reqAxis.title ?? "Values",
  //     label_format: reqAxis.label_format ?? Unit.Unknown,
  //     aggregation_points: []
  //   }

  //   for await (let agg_req of reqAxis.aggregation_points) {
  //     sources.push(agg_req.recordable);
  
  //     let ref: IAggregateResponse = {
  //       sources: {}, // stype-sid: IMeasurement
  //       recordable: agg_req.recordable,
  //       color: agg_req.color,
  //       data_format: agg_req.data_format,
  //       measurement: agg_req.measurement,
  //     };
  
  //     //just get all data on ourself from every creator if non passed in
  //     if (!agg_req.sources?.length) {
  //       agg_req.sources = await getMeasurementIntentionCreators(
  //         agg_req.recordable,
  //         agg_req.measurement
  //       )(req);
  //     }
  
  //     //get data from creators & props
  //     for await (const source of agg_req.sources) {
  //       sources.push(source);
  //       const [stype, sid] = source.split("-");
  
  //       ref.sources[source] = await getMeasurement(
  //         Sources.includes(stype as NodeType) ? source : null,
  //         Properties.includes(stype as NodeType) ? source : null,
  //         agg_req.recordable,
  //         agg_req.measurement,
  //         null,
  //         null,
  //         agg_req.data_format
  //       );
  
  //       // all sources have units converted, so remove extraneous data
  //       if(ref.sources[source]) {
  //         delete (<any>ref).sources[source].unit
  //       } else {
  //         ref.sources[source] = { times: [], values: [] }
  //       };
  //     }
  
  //     resAxis.aggregation_points.push(ref);
  //   }

  //   data.axes.push(resAxis);
  // }

  data.sources = (
    (await Promise.all(
      // distinct, get all sources
      [...new Set(sources)].map((r) => {
        const [rtype, rid] = r.split("-");
        return RecordableModel.read<IRecordable>(rid, DataModel.Stub, rtype as NodeType);
      })
    )
  )).reduce((acc: { [index: string]: IRecordable }, curr) => {
    // map into object
    acc[`${curr.type}-${curr._id}`] = curr;
    return acc;
  }, {});

  return data;
};

export const getMeasurementIntentionCreators = (intention?: string, measurement?: string) => {
  return async (req: Request): Promise<string[]> => {
    intention = intention || (req.query.intention as string);
    measurement = measurement || (req.query.measurement as string);

    if (!intention || !measurement)
      throw new ErrorHandler(HTTP.BadRequest, "Must pass intention & measurement");

    const q = `SHOW TAG VALUES FROM ${measurement} WITH KEY=creator WHERE intention='${intention}'`;
    const res = (await dbs.influx.query(q)).groups();

    return res.find((x) => x.name == measurement)?.rows?.map((x: any) => x.value) || [];
  };
};

export const readMeasurement = async (req: Request): Promise<IMeasurement> => {
  return await getMeasurement(
    req.query.creator as string,
    req.query.property as string,
    req.query.intention as string,
    req.query.measurement as Measurement | IoTState | IoTMeasurement,
    req.query.start_date as string,
    req.query.end_date as string,
    req.query.data_format as Unit | Type
  );
};

export const getMeasurement = async (
  creator?: string,
  property?: string,
  intention?: string,
  measurement?: Measurement | IoTState | IoTMeasurement,
  start_date?: string,
  end_date?: string,
  data_format?: Unit | Type
): Promise<IMeasurement> => {
  let whereables: string[] = [];
  if (intention) whereables.push(`intention='${intention}'`);
  if (start_date) whereables.push(`time > '${start_date}'`);
  if (end_date) whereables.push(`time < '${end_date}'`);
  if (creator) whereables.push(`creator='${creator}'`);
  if (property) whereables.push(`property='${property}'`);

  const q = `SELECT * from ${measurement}${
    whereables.length ? "\nWHERE " + whereables.join(" and ") : ";"
  }`;

  // execute query & format into IMeasurement
  // {air_temperature:{times:[Date, Date, Date], values:[Value, Value, Value], unit:Unit}}
  return (await dbs.influx.query(q))
    .groups()
    .reduce((acc: { [index: string]: IMeasurement }, curr) => {
      acc[curr.name] = curr.rows.reduce<IMeasurement>(
        (a, c: any) => {
          //take first unit if none provided
          data_format = data_format || c.data_format;

          // unit conversion
          if (
            data_format &&
            c.data_format !== data_format &&
            !Object.values(Type).includes(c.data_format) &&
            !NonConvertableUnits.includes(c.data_format)
          ) {
            c.value = convert(c.value)
              .from(c.data_format)
              .to(<any>data_format);
          }

          a.values.push(c.value);
          a.times.push(c.time);
          return a;
        },
        { times: [], values: [], unit: data_format }
      );
      return acc;
    }, {})[measurement];
};

export const createMeasurementAsDevice = async (req: Request) => {
  const device: IDeviceStub = (<any>req).device; //passed from validator
  const hwInfo = HardwareInformation[device.hardware_model];

  let data = req.body;

  //x-multipart-form-data handling
  if (req.files?.length) {
    let imgStateFiles: { [ref: string]: Express.Multer.File } = {};

    //Re-validate refs exist in device, since validator only operates on json body
    for (let i = 0; i < req.files.length; i++) {
      const file = (<Express.Multer.File[]>req.files)[i];
      if (Object.keys(hwInfo.states).includes(file.fieldname)) {
        imgStateFiles[file.fieldname] = file;
      }
    }

    //No valid refs in form-data
    if (!Object.keys(imgStateFiles).length)
      throw new Error(`Invalid refs in body for device model`);

    //upload all images to s3 bucket, returning item key as value
    data = (
      await Promise.all(
        Object.entries(imgStateFiles).map(([ref, file]) => {
          return new Promise(async (res, _) => {
            let awsImage = await uploadImageToS3(device._id, file);
            res({ ref: ref, value: awsImage.data.Key });
          });
        }) //format into key-value pair, like normal json input
      )
    ).reduce((acc: { [ref: string]: string }, curr: any) => {
      acc[curr.ref] = curr.value;
      return acc;
    }, {});
  }

  //get data intentions & upload to influx
  let res = await cypher(
    ` MATCH (d:Device {_id:$did})-[:HAS_PROPERTY]->(n)
      WHERE n.ref IN $refs
      OPTIONAL MATCH (n)-[:INTENDED_FOR]->(r)
      WHERE r:Farm OR r:Rack OR r:Crop or r:Device
      RETURN n,r`,
    {
      did: device._id,
      refs: Object.keys(data),
    }
  );

  const timestamp = Date.now();
  const points: Influx.IPoint[] = res.records.reduce((acc: Influx.IPoint[], curr: Record) => {
    const n = curr.get("n").properties;
    const r = curr.get("r")?.properties;

    let v = {
      measurement: n.measures,
      tags: {
        creator: `${NodeType.Device}-${device._id}`,
        property: `${n.type}-${n._id}`,
        intention: r ? `${r.type}-${r._id}` : null,
      },
      fields: {
        value: data[n.ref],
        data_format: n.data_format,
      },
      timestamp: timestamp,
    };

    //don't push null as intention
    if (v.tags.intention == null) delete v.tags.intention;
    acc.push(v);

    return acc;
  }, []);

  await dbs.influx.writePoints(points, { precision: "ms" });
  return;
};

export const getUnixEpoch = async (req: Request): Promise<string> => {
  return Math.floor(Date.now() / 1000).toString();
};
