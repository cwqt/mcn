import {
    IDeviceStub,
    IDevice,
    IApiKey,
    IUser,
    IOrgStub,
    IOrg,
    IUserStub,
    Paginated as P,
    IFarm,
    IFarmStub,
    IRack,
    IRackStub,
    ICrop,
    ICropStub,
    IDeviceProperty as IDP,
    NodeType as NT,
    IApiKeyPrivate,
    IOrgEnv,
    IMeasurementResult,
    ISpecies,
    ISpeciesStub,
    IDashboard,
    IDashboardItem,
    IAggregateData,
    IFlatNodeGraph,
    IFlorableGraph
} from "@cxss/interfaces";
import { Access } from "./mcnr";

import Users    = require("./controllers/Users/User.controller");
import Orgs     = require("./controllers/Orgs.controller");
import Auth     = require("./controllers/Auth.controller");
import Device   = require("./controllers/IoT/Device.controller");
import Routines = require("./controllers/IoT/Routines.controller");
import Farm     = require("./controllers/Hydroponics/Farm.controller");
import Rack     = require("./controllers/Hydroponics/Rack.controller");
import Crop     = require("./controllers/Hydroponics/Crop.controller");
import IoT      = require("./controllers/IoT/IoT.controller");
import Species  = require("./controllers/Hydroponics/Species.controller");

import { McnRouter } from "./mcnr";
import { cypher } from "./common/dbs";
import { NodeType } from "@cxss/interfaces";
import dbs from './common/dbs';

const mcnr = new McnRouter();

type nodeDef = [NodeType, string];
// USERS -----------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.get      <P<IUserStub>>    ("/users",                             Users.readAllUsers,                       [Access.SiteAdmin]);
mcnr.post     <IUser>           ("/users",                             Users.createUser,                         [Access.None],             Users.validators.createUser);
mcnr.post     <void>            ("/users/logout",                      Users.logoutUser,                         [Access.Authenticated]);
mcnr.post     <IUser>           ("/users/login",                       Users.loginUser,                          [Access.None],             Users.validators.loginUser);
mcnr.get      <IUser>           ("/u/:username",                       Users.readUserByUsername,                 [Access.None],             Users.validators.readUserByUsername);
mcnr.get      <IUser>           ("/users/:uid",                        Users.readUserById,                       [Access.None]);
mcnr.put      <IUser>           ("/users/:uid",                        Users.updateUser,                         [Access.Ourself]);
mcnr.get      <IOrgStub[]>      ("/users/:uid/orgs",                   Users.readUserOrgs,                       [Access.Authenticated]);
mcnr.put      <IUser>           ("/users/:uid/avatar",                 Users.updateUserAvatar,                   [Access.Ourself]);
mcnr.delete   <void>            ("/users/:uid",                        Users.deleteUser,                         [Access.Ourself]);

// AUTH ------------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.post     <IApiKey>         ("/auth/keys",                         Auth.createApiKey,                        [Access.Authenticated]);
mcnr.delete   <void>            ("/auth/keys/:kid",                    Auth.deleteApiKey,                        []);
mcnr.redirect <string>          ("/auth/verify",                       Auth.verifyUserEmail,                     [Access.None],              Auth.validators.verify);

// ORGS ------------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.get     <P<IOrgStub>>      ("/orgs",                              Orgs.readAllOrgs,                         [Access.SiteAdmin]);
mcnr.post    <IOrg>             ("/orgs",                              Orgs.createOrg,                           [Access.Authenticated],     Orgs.validators.createOrg);
mcnr.delete  <void>             ("/orgs/:oid",                         Orgs.deleteOrg,                           [Access.OrgAdmin]);
mcnr.delete  <IOrg>             ("/orgs/:oid",                         Orgs.updateOrg,                           [Access.OrgEditor]);
mcnr.get     <IOrgEnv>          ("/orgs/:oid/environment",             Orgs.getEnvironment,                      [Access.OrgMember]);
mcnr.get     <IDashboard>       ("/orgs/:oid/dashboard",               Orgs.getDashboard,                        [Access.OrgMember]);
mcnr.post    <IDashboardItem>   ("/orgs/:oid/dashboard/items",         Orgs.addItemToDashboard,                  [Access.OrgEditor]);
mcnr.put     <IDashboardItem>   ("/orgs/:oid/dashboard/items/:iid",    Orgs.updateDashboardItem,                 [Access.OrgEditor]);
mcnr.delete  <void>             ("/orgs/:oid/dashboard/items/:iid",    Orgs.deleteDashboardItem,                 [Access.OrgEditor]);
mcnr.get     <IFlorableGraph>   ("/orgs/:oid/graph",                   Orgs.readRecordablesGraph,                [Access.OrgMember]);

// ORG ITEMS -------------------------------------------------------------------------------------------------------------------------------------------------------
mcnr.put     <void>             ("/orgs/:oid/users/:uid/role",         Orgs.editUserRole,                        [Access.OrgAdmin]);
mcnr.get     <P<IUserStub>>     ("/orgs/:oid/users",                   Orgs.readOrgNodes(NodeType.User),         [Access.OrgMember]);
mcnr.get     <P<IDeviceStub>>   ("/orgs/:oid/devices",                 Orgs.readOrgNodes(NodeType.Device),       [Access.OrgMember]);
mcnr.get     <P<IFarmStub>>     ("/orgs/:oid/farms",                   Orgs.readOrgNodes(NodeType.Farm),         [Access.OrgMember]);
mcnr.post    <void>             ("/orgs/:oid/users/:iid",              Orgs.addNodeToOrg(NodeType.User),         [Access.OrgEditor]);
mcnr.post    <void>             ("/orgs/:oid/devices/:iid",            Orgs.addNodeToOrg(NodeType.Device),       [Access.OrgEditor]);
mcnr.post    <void>             ("/orgs/:oid/farms/:iid",              Orgs.addNodeToOrg(NodeType.Farm),         [Access.OrgEditor]);

// DEVICES ---------------------------------------------------------------------------------------------------------------------------------------------------------
const deviceDef:nodeDef = [NodeType.Device, "did"];
mcnr.get     <P<IDeviceStub>>   ("/devices",                           Device.readAllDevices,                   [Access.SiteAdmin]);
mcnr.post    <IDevice>          ("/devices",                           Device.createDevice,                     [Access.Authenticated],     Device.validators.createDevice);
mcnr.get     <IDevice>          ("/devices/:did",                      Device.readDevice,                       [Access.OrgMember],         null,                           deviceDef);
mcnr.put     <IDevice>          ("/devices/:did",                      Device.updateDevice,                     [Access.OrgEditor],         null,                           deviceDef);
mcnr.delete  <void>             ("/devices/:did",                      Device.deleteDevice,                     [],                         null,                           deviceDef);
mcnr.get                        ("/devices/:did/status",               Device.getStatus,                        [Access.Authenticated])
mcnr.get     <void>             ("/devices/:did/ping",                 Device.pingDevice,                       [Access.None]);     
mcnr.post    <IApiKeyPrivate>   ("/devices/:did/keys",                 Device.setApiKey,                        [Access.OrgEditor],         Device.validators.setApiKey,    deviceDef);
mcnr.get     <IApiKey>          ("/devices/:did/key",                  Device.readApiKey,                       [Access.OrgEditor],         null,                           deviceDef);
mcnr.put     <IApiKey>          ("/devices/:did/key",                  Device.updateApiKey,                     [Access.OrgEditor],         null,                           deviceDef);
mcnr.put     <void>             ("/devices/:did/key",                  Device.deleteApiKey,                     [Access.OrgEditor],         null,                           deviceDef);
mcnr.get     <IDP<NT.Sensor>[]> ("/devices/:did/sensors",              Device.readProperties(NodeType.Sensor),  [Access.OrgEditor],         null,                           deviceDef);
mcnr.get     <IDP<NT.State>[]>  ("/devices/:did/states",               Device.readProperties(NodeType.State),   [Access.OrgEditor],         null,                           deviceDef);
mcnr.get     <IDP<NT.Metric>[]> ("/devices/:did/metrics",              Device.readProperties(NodeType.Metric),  [Access.OrgEditor],         null,                           deviceDef);
mcnr.post    <void>             ("/devices/:did/properties/assign",    Device.assignManyProps,                  [Access.OrgMember]);
mcnr.get     <IFlatNodeGraph>   ("/devices/:did/properties/graph",     Device.readPropGraph,                    [Access.OrgMember]);
// mcnr.post                    ("/devices/:did/routines",             Device.Tasks.addRoutine);
// mcnr.delete                  ("devices/:did/routines",              Device.Tasks.removeRoutine);
// mcnr.post                    ("/devices/:did/routines/:trid/start", Device.Tasks.startRoutine);
// mcnr.delete                  ("/devices/:did/routines/:trid/stop",  Device.Tasks.stopRoutine);

// FARMS ------------------------------------------------------------------------------------------
const farmDef:nodeDef = [NodeType.Farm, "fid"];
mcnr.get     <P<IFarmStub>>     ("/farms",                             Farm.readAllFarms,                         [Access.SiteAdmin]);
mcnr.post    <IFarm>            ("/farms",                             Farm.createFarm,                           [Access.Authenticated],   Farm.validators.createFarm);
mcnr.get     <IFarm>            ("/farms/:fid",                        Farm.readFarm,                             [Access.OrgMember]);
// mcnr.put                     ("/farms/:fid",                        Farm.updateFarm,                           [Access.OrgEditor]);
// mcnr.delete                  ("/farms/:fid",                        Farm.deleteFarm,                           [Access.OrgEditor]);
mcnr.get     <IRackStub[]>      ("/farms/:fid/racks",                  Farm.readFarmRacks,                        [Access.OrgMember]);

// RACKS ------------------------------------------------------------------------------------------
const rackDef:nodeDef = [NodeType.Rack, "rid"];
// mcnr.get                     ("/racks",                             Rack.readAllRacks,                         [Access.SiteAdmin]);
mcnr.post    <IRack>            ("/farms/:fid/racks",                  Rack.createRack,                           [Access.Authenticated],   Rack.validators.createRack);
mcnr.get     <IRack>            ("/racks/:rid",                        Rack.readRack,                             [Access.OrgMember]);
// mcnr.put                     ("/racks/:rid",                        Rack.updateRack,                           [Access.OrgEditor]);
// mcnr.delete                  ("/racks/:rid",                        Rack.deleteRack,                           [Access.OrgEditor]);
mcnr.get     <ICropStub[]>      ("/racks/:rid/crops",                  Rack.readRackCrops,                        [Access.OrgMember]);
//mcnr.post                     ("/racks/:rid/harvest",                Rack.harvestCrops)

// CROPS ------------------------------------------------------------------------------------------
mcnr.post    <ICrop>            ("/racks/:rid/crops",                  Crop.createCrop,                           [Access.Authenticated],   Crop.validators.createCrop);
// mcnr.post                    ("/crops/:cid/harvest",                Crop.harvestCrop)
mcnr.put      <ICrop>           ("/crops/:cid/assign/:sid",            Crop.assignSpecies,                        [Access.Authenticated]);

// SPECIES ----------------------------------------------------------------------------------------
mcnr.post<ISpecies>             ("/species",                           Species.createSpecies,                     [Access.Authenticated],   Species.validators.createSpecies);
mcnr.get<ISpeciesStub[]>        ("/species/search",                    Species.search,                            [Access.Authenticated]);
mcnr.get                        ("/species/:sid",                      Species.readSpecies,                       [Access.Authenticated]);
mcnr.get                        ("/species/:sid/yields",               Species.readYields,                        [Access.Authenticated]);
mcnr.get                        ("/species/:sid/task_series",          Species.readSpeciesTaskSeries,             [Access.Authenticated]);

// TASK SERIES ----------------------------------------------------------------------------------
//mcnr.post                     ("/task_series",                       Task.createTaskSeries)
//mcnr.get                      ("/task_series/:tsid",                 Tasks.readTaskSeries)
//mcnr.put                      ("/task_series/:tsid",                 Task.updateTaskSeries)
//mcnr.post                     ("/task_series/:tsid/publish",         Task.publishTaskSeries)
//mcnr.delete                   ("/task_series/:tsid",                 Task.deleteTaskSeries)

//mcnr.post                     ("/task_series/:tsid/routines",        Task.createTaskRoutine)
//mcnr.get                      ("/task_series/:tsid/routines/:trid",  Task.readTaskRoutine)
//mcnr.put                      ("/task_series/:tsid/routines/:trid",  Task.updateTaskRoutine)

//mcnr.post                     ("/task_series/:tsid/routines/:trid/tasks", Task.createTask)
//mcnr.put                      ("/task_series/:tsid/routines/:trid/tasks/:tid", Task.updateTask)
//mcnr.delete                   ("/task_series/:tsid/routines/:trid/tasks/:tid", Task.deleteTask)

// IoT -------------------------------------------------------------------------------------------
mcnr.get                        ("/iot/time",                          IoT.getUnixEpoch,                          [Access.None]);
mcnr.post                       ('/iot/devices/:did',                  IoT.createMeasurementAsDevice,             [Access.OrgMember],       IoT.validators.createMeasurementAsDevice)
mcnr.get<IAggregateData>        ("/iot/data",                          IoT.getAggregateData,                      [Access.OrgMember]);
// mcnr.get<IMeasurementResult>    ("/iot/data",                          IoT.getMeasurements(),                     [Access.Authenticated],   IoT.validators.getMeasurements);
// mcnr.get                        ("/iot/types",                         IoT.getMeasurementTypes,                   [Access.None]);

// TEST -------------------------------------------------------------------------------------------
mcnr.post("/test/drop", async () => {
    await new Promise((res, rej) => dbs.redisClient.FLUSHDB(res));
    await cypher(`MATCH (n) DETACH DELETE n`, {});
    await dbs.influx.dropDatabase('iot');
    await dbs.influx.createDatabase('iot');
}, [Access.SiteAdmin]);
  
export default mcnr;
