// import { validate } from "../../common/validate";
// const AsyncRouter = require("express-async-router").AsyncRouter;
// const { body, param, query } = require("express-validator");

// import {
//   getTaskRoutines,
//   createTaskRoutine,
//   readRoutine,
//   createTaskInRoutine,
//   updateRoutine,
//   deleteRoutine,
//   executeTask,
//   updateTask,
//   deleteTask,
//   executeRoutine,
// } from "../../controllers/Device/Routines.controller";

// const router = AsyncRouter({ mergeParams: true });

// // ### `/users/:uid/devices/:did/routines`
// router.get("/", getTaskRoutines);
// router.post(
//   "/",
//   validate([
//     body("name").not().isEmpty().withMessage("TaskRoutine requires a name"),
//     body("cron")
//       .not()
//       .isEmpty()
//       .withMessage("TaskRoutine cron interval required"),
//     body("timezone")
//       .not()
//       .isEmpty()
//       .withMessage("TaskRoutine requires a timezone"),
//   ]),
//   createTaskRoutine
// );

// // ### `/users/:uid/devices/:did/routines/:rtid`
// const routineRouter = AsyncRouter({ mergeParams: true });
// router.use("/:trid", routineRouter);
// routineRouter.use(
//   validate([
//     param("trid").isMongoId().trim().withMessage("invalid TaskRoutine id"),
//   ])
// );

// routineRouter.get("/", readRoutine);
// routineRouter.put("/", updateRoutine);
// routineRouter.delete("/", deleteRoutine);
// routineRouter.post(
//   "/tasks",
//   validate([
//     body("name").not().isEmpty().withMessage("Task requires a name"),
//     body("command")
//       .not()
//       .isEmpty()
//       .withMessage("Task requires an mcnlang command"),
//   ]),
//   createTaskInRoutine
// );
// routineRouter.get("/execute", executeRoutine);

// // ### `/user/:uid/devices/:did/routines/:rtid/tasks/:tid`
// const taskRouter = AsyncRouter({ mergeParams: true });
// routineRouter.use("/tasks/:tid", taskRouter);
// taskRouter.use(
//   validate([param("tid").isMongoId().trim().withMessage("invalid Task id")])
// );

// taskRouter.put("/", updateTask);
// taskRouter.delete("/", deleteTask);
// taskRouter.get("/execute", executeTask);

// export default router;
