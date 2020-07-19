// import { Request, Response } from "express";
// import { Model, model } from "mongoose";
// import mongoose from "mongoose";

// import { IDevice } from "../../models/Device/Device.model";
// import { HTTP } from "../../common/http";
// import { ErrorHandler } from "../../common/errorHandler";
// import dbs, { cypher } from "../../common/dbs";
// import { MeasurementUnits } from "../../common/types/measurements.types";
// import { IGarden } from "../../models/Garden.model";
// import { IPlant } from "../../models/Plant.model";
// import {
//   IMeasurementModel,
//   IoTDataPacket,
//   IMeasurement,
//   RecorderType,
// } from "../../models/Measurement.model";

// import { RecordableType } from "../../models/Recordable.model";

// // ===============================================================================================================================

// export const createMeasurementAsDevice = async (
//   req: Request,
//   res: Response
// ) => {
//   let iotData = <IoTDataPacket>req.body;

//   //find devices' assigned recordable
//   let result = await cypher(
//     `
//         MATCH (d:Device {_id:$did})-[:MONITORS]->(r)
//         WHERE r:Plant OR r:Garden
//         RETURN r
//     `,
//     {
//       did: req.params.did,
//     }
//   );

//   let device: IDevice = res.locals.node;
//   let recordable: IPlant | IGarden = result.records[0]?.get("r")?.properties;
//   if (!recordable)
//     throw new ErrorHandler(
//       HTTP.NotFound,
//       "No such recordable assigned to this device"
//     );

//   console.log(iotData);

//   let date = Date.now();
//   await dbs.influx.writePoints([
//     {
//       measurement: device._id,
//       tags: { property: "metrics" },
//       fields: iotData.metrics,
//       timestamp: date,
//     },
//     {
//       measurement: device._id,
//       tags: { property: "states" },
//       fields: iotData.states,
//       timestamp: date,
//     },
//     {
//       measurement: recordable._id,
//       tags: {
//         property: "sensors",
//         recorder_type: RecorderType.Device,
//         recorder_id: device._id,
//       },
//       fields: iotData.sensors,
//       timestamp: date,
//     },
//   ]);

//   await cypher(
//     `
//         MATCH (d:Device {_id:$did})
//         SET d.last_ping = $date
//         SET d.measurement_count = d.measurement_count + 1
//         RETURN d
//     `,
//     {
//       did: req.params.did,
//       date: Date.now(),
//     }
//   );

//   res.status(HTTP.Created).end();
// };

// export const createMeasurementAsUser = async (req: Request, res: Response) => {
//   req.body = req.body as IoTDataPacket;
//   let measurement: IMeasurement = {
//     data: req.body.recordable_data,
//     recorder_type: RecorderType.User,
//     recorder_id: req.params.uid,
//     created_at: Date.now(),
//   };

//   try {
//     // await createMeasurement(measurement, res.locals.recordable_type, req.params.rid);
//   } catch (e) {
//     throw new ErrorHandler(HTTP.ServerError, e);
//   }
// };

// // export const readAllMeasurements = async (req:Request, res:Response) => {
// //     let page = req.query.page ? parseInt(req.query.page as string) : 1;
// //     let per_page = req.query.per_page ? parseInt(req.query.per_page as string) : 5;

// //     let data:IMeasurementModel[];
// //     try {
// //         let Recordable = getModel(res.locals.type, req.params.rid ?? req.params.did);
// //         // let measurement_count = await Recordable.countDocuments({});
// //         data = await Recordable.find({})
// //             .sort({'created_at': -1 })
// //             .skip((page - 1) * per_page)
// //             .limit(per_page)
// //     } catch(e) {
// //         throw new ErrorHandler(HTTP.ServerError, e);
// //     }

// //     res.json(data)
// // }

// // export const readAllMeasurements = async (req:Request, res:Response) => {
// //     let Measurement = getModel(res.locals.recordable_type, req.params.rid);
// //     try {
// //         let ms:IMeasurementModel[] = await Measurement.find({recordable_id:req.params.rid}).select('-recordable_id')
// //         res.json(ms);
// //     } catch (e) {
// //         throw new ErrorHandler(HTTP.ServerError, e)
// //     }
// // }

// // export const deleteMeasurements = async (req:Request, res:Response) => {
// //     let Measurement = getModel(res.locals.recordable_type, req.params.rid);
// //     try {
// //         let result = await Measurement.deleteMany(req.body);
// //         console.log(result);
// //         res.status(HTTP.OK).end();
// //     } catch (e) {
// //         throw new ErrorHandler(HTTP.ServerError, e)
// //     }
// // }

// // export const getMeasurementTypes = (req:Request, res:Response) => {
// //     res.json(MeasurementUnits);
// // }

// // export const deleteMeasurementCollection = async (req:Request, res:Response) => {
// //     try {
// //         let result = await mongoose.connection.dropCollection(`${res.locals.recordable_type}-${req.params.rid}`);
// //         res.status(HTTP.OK);
// //     } catch (e) {
// //         throw new ErrorHandler(HTTP.ServerError, e);
// //     }
// // }
