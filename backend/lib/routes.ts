import { IDeviceStub, IDevice, IApiKey, IUser, IOrgStub, IOrg, IUserStub, Paginated as P, IFarm, IFarmStub, IRack, IRackStub, ICrop, ICropStub } from '@cxss/interfaces';

import { Access } from "./mcnr";

import Users = require("./controllers/Users/User.controller");
import Orgs = require("./controllers/Orgs.controller");
// import IoT = require("./controllers/IoT/IoT.controller");
import Auth = require("./controllers/Auth.controller");
// import Routines = require("./controllers/IoT/Routines.controller");
import Device = require("./controllers/IoT/Device.controller");
import Farm = require("./controllers/Hydroponics/Farm.controller");
import Rack = require("./controllers/Hydroponics/Rack.controller");
import Crop = require("./controllers/Hydroponics/Crops.controller");

import { McnRouter } from "./mcnr";
import { cypher } from "./common/dbs";
import { NodeType } from "@cxss/interfaces";
import dbs from './common/dbs';
const mcnr = new McnRouter();

type nodeDef = [NodeType, string];
// USERS -----------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.get      <P<IUserStub>> ("/users",                      Users.readAllUsers,                       [Access.SiteAdmin]);
mcnr.post     <IUser>        ("/users",                      Users.createUser,                         [Access.None],             Users.validators.createUser);
mcnr.post     <void>         ("/users/logout",               Users.logoutUser,                         [Access.Authenticated]);
mcnr.post     <IUser>        ("/users/login",                Users.loginUser,                          [Access.None],             Users.validators.loginUser);
mcnr.get      <IUser>        ("/u/:username",                Users.readUserByUsername,                 [Access.None],             Users.validators.readUserByUsername);
mcnr.get      <IUser>        ("/users/:uid",                 Users.readUserById,                       [Access.None]);
mcnr.put      <IUser>        ("/users/:uid",                 Users.updateUser,                         [Access.Ourself]);
mcnr.get      <IOrgStub[]>   ("/users/:uid/orgs",            Users.readUserOrgs,                       [Access.Authenticated]);
mcnr.put      <IUser>        ("/users/:uid/avatar",          Users.updateUserAvatar,                   [Access.Ourself]);
mcnr.delete   <void>         ("/users/:uid",                 Users.deleteUser,                         [Access.Ourself]);

// AUTH ------------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.post     <IApiKey>      ("/auth/keys",                  Auth.createApiKey,                        [Access.Authenticated]);
mcnr.delete   <void>         ("/auth/keys/:kid",             Auth.deleteApiKey,                        []);
mcnr.redirect <string>       ("/auth/verify",                Auth.verifyUserEmail,                     [Access.None],              Auth.validators.verify);

// ORGS ------------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.get     <P<IOrgStub>>   ("/orgs",                       Orgs.readAllOrgs,                         [Access.SiteAdmin]);
mcnr.post    <IOrg>          ("/orgs",                       Orgs.createOrg,                           [Access.Authenticated],     Orgs.validators.createOrg);
mcnr.delete  <void>          ("/orgs/:oid",                  Orgs.deleteOrg,                           [Access.OrgAdmin]);
mcnr.delete  <IOrg>          ("/orgs/:oid",                  Orgs.updateOrg,                           [Access.OrgEditor]);

// // ORG ITEMS -------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.put     <void>          ("/orgs/:oid/users/:uid/role",  Orgs.editUserRole,                        [Access.OrgAdmin]);
mcnr.get     <P<IUserStub>>  ("/orgs/:oid/users",            Orgs.readOrgNodes(NodeType.User),         [Access.OrgMember]);
mcnr.get     <P<IDeviceStub>>("/orgs/:oid/devices",          Orgs.readOrgNodes(NodeType.Device),       [Access.OrgMember]);
mcnr.get     <P<IFarmStub>>  ("/orgs/:oid/farms",            Orgs.readOrgNodes(NodeType.Farm),         [Access.OrgMember]);
mcnr.post    <void>          ("/orgs/:oid/users/:iid",       Orgs.addNodeToOrg(NodeType.User),         [Access.OrgEditor]);
mcnr.post    <void>          ("/orgs/:oid/devices/:iid",     Orgs.addNodeToOrg(NodeType.Device),       [Access.OrgEditor]);
mcnr.post    <void>          ("/orgs/:oid/farms/:iid",       Orgs.addNodeToOrg(NodeType.Farm),         [Access.OrgEditor]);


// DEVICES ---------------------------------------------------------------------------------------------------------------------------------------------------------
const deviceDef:nodeDef = [NodeType.Device, "did"];
mcnr.get     <P<IDeviceStub>>("/devices",                     Device.readAllDevices,                   [Access.SiteAdmin]);
mcnr.post    <IDevice>       ("/devices",                     Device.createDevice,                     [Access.Authenticated],     Device.validators.createDevice);
mcnr.get     <IDevice>       ("/devices/:did",                Device.readDevice,                       [Access.OrgMember],         null,                           deviceDef);
mcnr.put     <IDevice>       ("/devices/:did",                Device.updateDevice,                     [Access.OrgEditor],         null,                           deviceDef);
mcnr.delete  <void>          ("/devices/:did",                Device.deleteDevice,                     [],                         null,                           deviceDef);
mcnr.post    <void>          ("/devices/:did/assign",         Device.assignDevice,                     [Access.OrgEditor],         Device.validators.assignDevice, deviceDef);
mcnr.get     <void>          ("/devices/:did/ping",           Device.pingDevice,                       [Access.None]);     
mcnr.post    <void>          ("/devices/:did/keys",           Device.setApiKey,                        [Access.OrgEditor],         Device.validators.setApiKey,    deviceDef);
// mcnr.get<IApiKey[]>("/devices/:did/keys",         Device.readApiKey,                          [Access.OrgEditor],         null,                           deviceDef);
// mcnr.put<IApiKey>("/devices/:did/keys/:kid",      Device.updateApiKey,                        [Access.OrgEditor],         null,                           deviceDef);
// mcnr.put<IApiKey>("/devices/:did/keys/:kid",      Device.deleteApiKey,                        [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get<IDeviceProp[]>("/devices/:did/sensors",  Device.readProperties(NodeType.Sensor),     [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get<IDeviceProp[]>("/devices/:did/states",   Device.readProperties(NodeType.State),      [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get<IDeviceProp[]>("/devices/:did/metrics",  Device.readProperties(NodeType.Metric),     [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get("/devices/:did/sensors/:pid",            Device.readPropertyData(NodeType.Sensor),   [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get("/devices/:did/states/:pid",             Device.readPropertyData(NodeType.State),    [Access.OrgEditor],         null,                           deviceDef);
// mcnr.get("/devices/:did/metrics/:pid",            Device.readPropertyData(NodeType.Metric),   [Access.OrgEditor],         null,                           deviceDef);

// FARMS ------------------------------------------------------------------------------------------
const farmDef:nodeDef = [NodeType.Farm, "fid"];
mcnr.get     <P<IFarmStub>>  ("/farms",                       Farm.readAllFarms,                         [Access.SiteAdmin]);
mcnr.post    <IFarm>         ("/farms",                       Farm.createFarm,                           [Access.Authenticated], Farm.validators.createFarm);
mcnr.get     <IFarm>         ("/farms/:fid",                  Farm.readFarm,                             [Access.OrgMember]);
// mcnr.put("/farms/:fid",                 Farm.updateFarm,                           [Access.OrgEditor]);
// mcnr.delete("/farms/:fid",              Farm.deleteFarm,                           [Access.OrgEditor]);

mcnr.get     <IRackStub[]>   ("/farms/:fid/racks",            Farm.readFarmRacks,                        [Access.OrgMember]);

// RACKS ------------------------------------------------------------------------------------------
const rackDef:nodeDef = [NodeType.Rack, "rid"];
// mcnr.get("/racks",                      Rack.readAllRacks,                         [Access.SiteAdmin]);
mcnr.post    <IRack>         ("/farms/:fid/racks",            Rack.createRack,                           [Access.Authenticated], Rack.validators.createRack);
// mcnr.get("/racks/:rid",                 Rack.readFarm,                             [Access.OrgViewer]);
// mcnr.put("/racks/:rid",                 Rack.updateRack,                           [Access.OrgEditor]);
// mcnr.delete("/racks/:rid",              Rack.deleteRack,                           [Access.OrgEditor]);
mcnr.get<ICropStub[]>("/racks/:rid/crops", Rack.readRackCrops, [Access.OrgMember]);

// CROPS ------------------------------------------------------------------------------------------
mcnr.post    <ICrop>         ("/racks/:rid/crops",            Crop.createCrop,                           [Access.Authenticated], Crop.validators.createCrop);

// SPECIES ----------------------------------------------------------------------------------------

// RECIPIES ---------------------------------------------------------------------------------------


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
