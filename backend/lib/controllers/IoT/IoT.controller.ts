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
  IMeasurementResult,
  IMeasurement,
  IAggregateData,
  Unit,
  IAggregateRequest,
  IAggregatePoint,
  IAggregatePointResult,
  NonConvertableUnits,
  Type,
} from "@cxss/interfaces";

import { Types } from "mongoose";
import { Record } from "neo4j-driver";
import Device from "../../classes/IoT/Device.model";
import { uploadImageToS3 } from "../../common/storage";
import Influx from "influx";

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

export const getAggregateData = async (req: Request): Promise<IAggregateData> => {
  let body: IAggregateRequest = req.body;
  let data: IAggregateData = {
    sources: {},
    data: {},
  };

  for await (let [recordable, aggregation_points] of Object.entries(body.aggregation_points)) {
    if (!Object.keys(data.sources).includes(recordable)) {
      //get recordable stub
    }

    data.data[recordable] = {};

    for await (let aggregation_point of aggregation_points) {
      for (let m of aggregation_point.measurements) {
        let ref: IAggregatePointResult = (data.data[recordable][m.measurement] = {
          color: m.color,
          data_format: m.data_format,
          sources: {},
        });

        console.log(ref);

        for await (const [idx, sourceType] of [
          aggregation_point.creators || [],
          aggregation_point.properties || [],
        ].entries()) {
          console.log(sourceType);
          for (const source of sourceType) {
            ref.sources[source] = (
              await getMeasurement(
                idx == 0 ? source : null,
                idx == 0 ? null : source,
                recordable,
                m.measurement,
                null,
                null,
                m.data_format
              )
            )[m.measurement];
            console.log("--->", ref.sources[source]);
          }
        }
      }
    }

    console.log(data.data);
  }

  return data;
};

export const getMeasurement = async (
  creator?: string,
  property?: string,
  intention?: string,
  measurement?: Measurement | IoTState | IoTMeasurement,
  start_date?: string,
  end_date?: string,
  data_format?: Unit | Type
) => {
  let whereables: string[] = [];
  if (intention) whereables.push(`intention='${intention}'`);
  if (start_date) whereables.push(`time > '${start_date}'`);
  if (end_date) whereables.push(`time < '${end_date}'`);
  if (creator) whereables.push(`creator='${creator}'`);
  if (property) whereables.push(`property='${property}'`);

  const q = `SELECT * from ${measurement}${
    whereables.length ? "\nWHERE " + whereables.join(" and ") : ";"
  }`;

  console.log(measurement, q);

  // execute query & format into IMeasurement
  // {air_temperature:{times:[Date, Date, Date], values:[Value, Value, Value], unit:Unit}}
  return (await dbs.influx.query(q))
    .groups()
    .reduce((acc: { [index: string]: IMeasurement }, curr) => {
      acc[curr.name] = curr.rows.reduce<IMeasurement>(
        (a, c: any) => {
          //take first unit if none provided
          data_format = data_format || c.data_format;

          console.log(data_format, c.data_format);

          // unit conversion
          if (
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
    }, {});
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
      WHERE r:Farm OR r:Rack OR r:Crop 
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
