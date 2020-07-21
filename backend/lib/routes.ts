import { Access } from "./mcnr";
import { Request, Response } from 'express';
import config from './config';

import Users = require("./controllers/Users/User.controller");
import Orgs = require("./controllers/Orgs.controller");
// import IoT = require("./controllers/IoT/IoT.controller");
import Auth = require("./controllers/Auth.controller");
import Routines = require("./controllers/IoT/Routines.controller");
import Device = require("./controllers/IoT/Device.controller");

import { McnRouter } from "./mcnr";
import { cypher } from "./common/dbs";
import { NodeType } from "@cxss/interfaces";
import dbs from './common/dbs';
const mcnr = new McnRouter();

// USERS ------------------------------------------------------------------------------------------
mcnr.post("/users",                     Users.createUser,                           [Access.None],             Users.validators.createUser);
mcnr.post("/users/logout",              Users.logoutUser,                           [Access.Authenticated]);
mcnr.post("/users/login",               Users.loginUser,                            [Access.None],             Users.validators.loginUser);
mcnr.get("/u/:username",                Users.readUserByUsername,                   [Access.None],             Users.validators.readUserByUsername);
mcnr.get("/users/:uid",                 Users.readUserById,                         [Access.None]);
mcnr.put("/users/:uid",                 Users.updateUser,                           [Access.Ourself]);
mcnr.get("/users/:uid/orgs",            Users.readUserOrgs,                         [Access.Authenticated]);
mcnr.put("/users/:uid/avatar",          Users.updateUserAvatar,                     [Access.Ourself]);
mcnr.delete("/users/:uid",              Users.deleteUser,                           [Access.Ourself]);

// AUTH -------------------------------------------------------------------------------------------
mcnr.post("/auth/keys",                 Auth.createApiKey,                          [Access.Authenticated]);
mcnr.delete("/auth/keys/:kid",          Auth.deleteApiKey,                          []);
mcnr.redirect("/auth/verify",           Auth.verifyUserEmail,                       [Access.None],              Auth.validators.verify);

// DEVICES ----------------------------------------------------------------------------------------
mcnr.get("/devices",                    Device.readAllDevices,                      [Access.SiteAdmin]);
mcnr.post("/devices",                   Device.createDevice,                        [Access.Authenticated],     Device.validators.createDevice);
mcnr.get("/devices/:did",               Device.readDevice,                          [Access.OrgMember],         null,                           [NodeType.Device, "did"]);
mcnr.put("/devices/:did",               Device.updateDevice,                        [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.delete("/devices/:did",            Device.deleteDevice,                        [],                         null,                           [NodeType.Device, "did"]);
mcnr.post("/devices/:did/assign",       Device.assignDevice,                        [Access.OrgEditor],         Device.validators.assignDevice, [NodeType.Device, "did"])
mcnr.get("/devices/:did/ping",          Device.pingDevice,                          [Access.None]);     
mcnr.post("/devices/:did/keys",         Device.setApiKey,                           [Access.OrgEditor],         Device.validators.setApiKey,    [NodeType.Device, "did"]);
mcnr.get("/devices/:did/keys",          Device.readApiKey,                          [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.put("/devices/:did/keys/:kid",     Device.updateApiKey,                        [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.put("/devices/:did/keys/:kid",     Device.deleteApiKey,                        [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/sensors",       Device.readProperties(NodeType.Sensor),     [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/states",        Device.readProperties(NodeType.State),      [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/metrics",       Device.readProperties(NodeType.Metric),     [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/sensors/:pid",  Device.readPropertyData(NodeType.Sensor),   [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/states/:pid",   Device.readPropertyData(NodeType.State),    [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);
mcnr.get("/devices/:did/metrics/:pid",  Device.readPropertyData(NodeType.Metric),   [Access.OrgEditor],         null,                           [NodeType.Device, "did"]);

// ORGS -------------------------------------------------------------------------------------------
mcnr.get("/orgs",                       Orgs.readAllOrgs,                           [Access.SiteAdmin]);
mcnr.post("/orgs",                      Orgs.createOrg,                             [Access.Authenticated],    Orgs.validators.createOrg);

mcnr.delete("/orgs/:oid",               Orgs.deleteOrg,                             [Access.OrgAdmin]);
mcnr.delete("/orgs/:oid",               Orgs.updateOrg,                             [Access.OrgEditor]);

// ORG USERS ---------------------------------------------------------------------------------
mcnr.post("/orgs/:oid/users/:iid",      Orgs.addNodeToOrg(NodeType.User),           [Access.OrgEditor]);
mcnr.post("/orgs/:oid/devices/:iid",    Orgs.addNodeToOrg(NodeType.Device),         [Access.OrgEditor]);
mcnr.put("/orgs/:oid/users/:uid/role",  Orgs.editUserRole,                          [Access.OrgAdmin]);

// ORG DEVICES -------------------------------------------------------------------------------
mcnr.post("/orgs/:oid/devices/:iid",   Orgs.addNodeToOrg(NodeType.Device),          [Access.OrgEditor]);
mcnr.get("/orgs/:oid/devices",         Orgs.readOrgNodes(NodeType.Device),          [Access.OrgMember]);



// TASK ROUTINES ----------------------------------------------------------------------------------
// TODO: figure out how task routines relate to devices/crops
// mcnr.get("/routines",   Routines.getTaskRoutines)


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


// IoT -------------------------------------------------------------------------------------------
// mcnr.get("/iot/time", IoT.getUnixEpoch, [Access.None]);
// //seconds since unix epoch
// router.get("/time", (req: Request, res: Response) => {
//   const now = new Date();
//   return res.status(HTTP.OK).send(Math.round(now.getTime() / 1000));
// });

// TEST -------------------------------------------------------------------------------------------
// if(config.TESTING) {
    mcnr.post("/test/drop", async () => {
        dbs.redisClient.FLUSHDB(() => {
            cypher(`MATCH (n) DETACH DELETE n`, {}).then(() => {
                return;
            });
        })
    }, []);
// }
  
export default mcnr;
