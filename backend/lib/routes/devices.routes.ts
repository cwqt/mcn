import { Router, NextFunction, Request, Response } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../common/validate";
var AsyncRouter = require("express-async-router").AsyncRouter;

// import { readAllMeasurements } from '../controllers/Device/Measurements.controller';
import {
  createDevice,
  readDevice,
  updateDevice,
  deleteDevice,
  assignDeviceToRecordable,
  readDeviceProperties,
  pingDevice,
} from "../controllers/Device/Device.controller";
import {
  createApiKey,
  readApiKey,
  deleteApiKey,
} from "../controllers/Device/ApiKeys.controller";
import {
  updateSensor,
  deleteSensor,
} from "../controllers/Device/Sensor.controller";

import { RecordableType } from "../models/Recordable.model";
import { readAllRecordables } from "../controllers/Recordables/Recordable.controller";
import {
  heartPostable,
  unheartPostable,
  repostPostable,
} from "../controllers/Postable.controller";

import { setLocalsFlag } from "./iot.routes";

import routines from "./routines.routes";
import {
  Measurement,
  MeasurementUnits,
  IoTMeasurement,
  IoTState,
  Unit,
} from "../common/types/measurements.types";
import { HardwareInformation } from "../common/types/hardware.types";

const router = AsyncRouter({ mergeParams: true });
router.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.type = RecordableType.Device;
  next();
});

router.get("/", readAllRecordables);
router.post(
  "/",
  validate([
    body("name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("device must have friendly name"),
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
  createDevice
);

// DEVICES ========================================================================================
const deviceRouter = AsyncRouter({ mergeParams: true });
router.use("/:did", deviceRouter);

deviceRouter.use(
  validate([param("did").isMongoId().trim().withMessage("invalid device id")])
);

deviceRouter.get("/", readDevice);
// deviceRouter.get('/measurements',   readAllMeasurements);
deviceRouter.get("/ping", pingDevice);
deviceRouter.post("/repost", repostPostable);
deviceRouter.post("/heart", heartPostable);
deviceRouter.delete("/heart", unheartPostable);

deviceRouter.post(
  "/assign/:rid",
  validate([
    param("rid")
      .isMongoId()
      .trim()
      .withMessage("invalid recordable id to assign to"),
  ]),
  assignDeviceToRecordable
);

router.put(
  "/:did",
  validate([param("did").isMongoId().trim().withMessage("invalid device id")]),
  updateDevice
);

router.delete(
  "/:did",
  validate([param("did").isMongoId().trim().withMessage("invalid device id")]),
  deleteDevice
);

deviceRouter.post(
  "/keys",
  validate([
    body("key_name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("device name must be named"),
  ]),
  createApiKey
);

deviceRouter.get(
  "/sensors",
  setLocalsFlag({ relationship: "HAS_SENSOR", node_type: "Sensor" }),
  readDeviceProperties
);
deviceRouter.get(
  "/states",
  setLocalsFlag({ relationship: "HAS_STATE", node_type: "State" }),
  readDeviceProperties
);
deviceRouter.get(
  "/metrics",
  setLocalsFlag({ relationship: "HAS_METRIC", node_type: "Metric" }),
  readDeviceProperties
);

deviceRouter.get("/sensors/:pid", setLocalsFlag({ node_type: "Sensor" }));
deviceRouter.get("/states/:pid", setLocalsFlag({ node_type: "State" }));
deviceRouter.get("/metrics/:pid", setLocalsFlag({ node_type: "Metric" }));

deviceRouter.use("/routines", routines);

// API KEYS =======================================================================================
const keyRouter = AsyncRouter({ mergeParams: true });
deviceRouter.use("/keys/:kid", keyRouter);

keyRouter.use(
  validate([param("kid").isMongoId().trim().withMessage("invalid key id")])
);

keyRouter.get("/", readApiKey);
keyRouter.delete("/", deleteApiKey);

// SENSORS ========================================================================================
const sensorRouter = AsyncRouter({ mergeParams: true });
deviceRouter.use("/sensors/:sid", sensorRouter);

sensorRouter.put("/", updateSensor);
sensorRouter.delete("/", deleteSensor);

export default router;
