import { validate } from "../../common/validate";
const { body, param } = require("express-validator");
const AsyncRouter = require("express-async-router").AsyncRouter;

import { Request, Response, NextFunction } from "express";

import {
  Measurement as AcceptedMeasurement,
  IoTMeasurement,
} from "../../common/types/measurements.types";
import { authenticateApiKey } from "../../controllers/Auth.controller";
import {
  createMeasurementAsDevice,
  createMeasurementAsUser,
} from "../../controllers/Device/Measurements.controller";
import { RecorderType, IoTDataPacket } from "../../models/Measurement.model";
import { RecordableType } from "../../models/Recordable.model";
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";

import { HardwareInformation } from "../../common/types/hardware.types";

const router = AsyncRouter({ mergeParams: true });

const validateIoTDataPacket = (device: IDevice) => {
  return body().custom((data: any) => {});
};

import { cypher } from "../../common/dbs";
import { IDevice } from "../../models/Device/Device.model";

export const setLocalsFlag = (object: { [index: string]: string }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Object.keys(object).forEach((k) => (res.locals[k] = object[k]));
    next();
  };
};

const getNode = (node_type: string, parameter: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    cypher(
      `
        MATCH (n:${node_type} {_id:$id})
        RETURN n
    `,
      { id: req.params[parameter] }
    ).then((result) => {
      if (result.records[0]?.get("n")) {
        res.locals.node = result.records[0].get("n").properties;
      } else {
        throw new Error("no node");
      }
      next();
    });
  };
};

// //users have no link to a recordable & require an explict link in the route param
// router.post('/users/:uid/:rtype/:rid', validate([
//     param('uid').isMongoId().trim().withMessage('invalid user id'),
//     param('rid').isMongoId().trim().withMessage('invalid recordable id'),
//     validateRecordableMeasurementTypes()
// ]), ((req:Request, res:Response, next:NextFunction) => {
//     res.locals["recorder_type"] = RecorderType.User
//     //de-pluralise
//     switch(req.params.rtype.slice(0, req.params.rtype.length - 1)) {
//         case RecordableType.Plant:
//             res.locals["recordable_type"] = RecordableType.Plant
//             break;
//         case RecordableType.Garden:
//             res.locals["recordable_type"] = RecordableType.Garden
//             break;
//         default:
//             throw new ErrorHandler(HTTP.BadRequest, `Invalid recordable type: ${req.params.rtype}`);
//     }
//     next();
// }), createMeasurementAsUser)

router.use(
  "/devices/:did",
  validate([param("did").isMongoId().trim().withMessage("Not a valid _id")]),
  setLocalsFlag({ recorder_type: RecordableType.Device }),
  getNode("Device", "did")
);

router.post(
  "/devices/:did",
  (req: Request, res: Response, next: NextFunction) => {
    let d = HardwareInformation[(<IDevice>res.locals.node).hardware_model];
    let validRefs = [
      ...Object.keys(d.sensors),
      ...Object.keys(d.states),
      ...Object.keys(d.metrics),
    ];
    if (
      Object.keys(req.body).sort().toString() != validRefs.sort().toString()
    ) {
      console.log(validRefs, Object.keys(req.body));
      res.status(HTTP.DataInvalid).json({
        msg: "IoTDataPacket not equal to hardware definition",
        location: "body",
      });
    } else {
      let iotData: IoTDataPacket = {
        sensors: {},
        states: {},
        metrics: {},
      };

      let keys = Object.keys(req.body);
      for (let i = 0; i < keys.length; i++) {
        if (d.sensors.hasOwnProperty(keys[i])) {
          iotData.sensors[keys[i]] = req.body[keys[i]];
          continue;
        }
        if (d.states.hasOwnProperty(keys[i])) {
          iotData.states[keys[i]] = req.body[keys[i]];
          continue;
        }
        if (d.metrics.hasOwnProperty(keys[i])) {
          iotData.metrics[keys[i]] = req.body[keys[i]];
          continue;
        }
      }

      req.body = iotData;
      next();
    }
  },
  createMeasurementAsDevice
);

//seconds since unix epoch
router.get("/time", (req: Request, res: Response) => {
  const now = new Date();
  return res.status(HTTP.OK).send(Math.round(now.getTime() / 1000));
});

export default router;
