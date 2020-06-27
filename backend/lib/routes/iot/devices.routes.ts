// import { Router, NextFunction, Request, Response } from "express";
// const { body, param, query } = require("express-validator");
// import { validate } from "../../common/validate";
// var AsyncRouter = require("express-async-router").AsyncRouter;

// // import { readAllMeasurements } from '../controllers/Device/Measurements.controller';
// import {
//   createDevice,
//   readDevice,
//   updateDevice,
//   deleteDevice,
//   assignDeviceToRecordable,
//   readDeviceProperties,
//   pingDevice,
//   readDevicePropertyData,
// } from "../../controllers/Device/Device.controller";
// import {
//   createApiKey,
//   readApiKey,
//   deleteApiKey,
// } from "../../controllers/Device/ApiKeys.controller";

// import { RecordableType } from "../../models/Recordable.model";
// import { readAllRecordables } from "../../controllers/Recordables/Recordable.controller";
// import {
//   heartPostable,
//   unheartPostable,
//   repostPostable,
// } from "../../controllers/Postable.controller";

// import { setLocalsFlag } from "./iot.routes";

// import routines from "./routines.routes";
// import { HardwareInformation } from "../../common/types/hardware.types";

// const router = AsyncRouter({ mergeParams: true });
// router.use((req: Request, res: Response, next: NextFunction) => {
//   res.locals.type = RecordableType.Device;
//   next();
// });

// router.get("/", readAllRecordables);
// router.post(
//   "/",
//   validate([
//     body("name")
//       .not()
//       .isEmpty()
//       .trim()
//       .withMessage("device must have friendly name"),
//     body("hardware_model")
//       .not()
//       .isEmpty()
//       .withMessage("Must have hardware model")
//       .custom((model: string, { req }: any) => {
//         if (!Object.keys(HardwareInformation).includes(model))
//           throw new Error("Un-supported hardware model");
//         return true;
//       }),
//   ]),
//   createDevice
// );

// // DEVICES ========================================================================================
// const deviceRouter = AsyncRouter({ mergeParams: true });
// router.use("/:did", deviceRouter);

// deviceRouter.use(
//   validate([param("did").isMongoId().trim().withMessage("invalid device id")])
// );

// deviceRouter.get("/", readDevice);
// deviceRouter.put("/", updateDevice);
// deviceRouter.delete("/", deleteDevice);

// deviceRouter.get("/ping", pingDevice);
// deviceRouter.post("/repost", repostPostable);
// deviceRouter.post("/heart", heartPostable);
// deviceRouter.delete("/heart", unheartPostable);

// deviceRouter.post(
//   "/assign/:rid",
//   validate([
//     param("rid")
//       .isMongoId()
//       .trim()
//       .withMessage("invalid recordable id to assign to"),
//   ]),
//   assignDeviceToRecordable
// );

// deviceRouter.post(
//   "/keys",
//   validate([
//     body("key_name")
//       .not()
//       .isEmpty()
//       .trim()
//       .withMessage("device name must be named"),
//   ]),
//   createApiKey
// );

// deviceRouter.get(
//   "/sensors",
//   setLocalsFlag({ node_type: "Sensor" }),
//   readDeviceProperties
// );
// deviceRouter.get(
//   "/states",
//   setLocalsFlag({ node_type: "State" }),
//   readDeviceProperties
// );
// deviceRouter.get(
//   "/metrics",
//   setLocalsFlag({ node_type: "Metric" }),
//   readDeviceProperties
// );

// deviceRouter.get(
//   "/sensors/:pid",
//   setLocalsFlag({ node_type: "Sensor" }),
//   readDevicePropertyData
// );
// deviceRouter.get(
//   "/states/:pid",
//   setLocalsFlag({ node_type: "State" }),
//   readDevicePropertyData
// );
// deviceRouter.get(
//   "/metrics/:pid",
//   setLocalsFlag({ node_type: "Metric" }),
//   readDevicePropertyData
// );

// deviceRouter.use("/routines", routines);

// // API KEYS =======================================================================================
// const keyRouter = AsyncRouter({ mergeParams: true });
// deviceRouter.use("/keys/:kid", keyRouter);

// keyRouter.use(
//   validate([param("kid").isMongoId().trim().withMessage("invalid key id")])
// );

// keyRouter.get("/", readApiKey);
// keyRouter.delete("/", deleteApiKey);

// export default router;
