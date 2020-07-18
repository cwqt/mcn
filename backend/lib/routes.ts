import { Access } from "./router";
import { Request, Response } from 'express';

import Users = require("./controllers/Users/User.controller");
import Orgs = require("./controllers/Orgs.controller");
import IoT = require("./controllers/IoT/IoT.controller");

import { McnRouter } from "./router";
import { cypher } from "./common/dbs";
const mcnr = new McnRouter();

// USERS ------------------------------------------------------------------------------------------
mcnr.post("/users",            Users.createUser,         [Access.None],           Users.validators.createUser);
mcnr.post("/users/logout",     Users.logoutUser,         [Access.Authenticated]);
mcnr.post("/users/login",      Users.loginUser,          [Access.None],           Users.validators.loginUser);
mcnr.get("/u/:username",       Users.readUserByUsername, [Access.None],           Users.validators.readUserByUsername);
mcnr.get("/users/:uid",        Users.readUserById,       [Access.None]);
mcnr.put("/users/:uid",        Users.updateUser,         [Access.Ourself]);
mcnr.get("/users/:uid/orgs",   Users.readUserOrgs,       [Access.Authenticated]);
mcnr.put("/users/:uid/avatar", Users.updateUserAvatar,   [Access.Ourself]);
mcnr.delete("/users/:uid",     Users.deleteUser,         [Access.Ourself]);

// ORGS -------------------------------------------------------------------------------------------
mcnr.post("/orgs",             Orgs.createOrg,      [Access.Authenticated],     Orgs.validators.createOrg);
mcnr.get("/nodes",             Orgs.readOrgNodes,   [Access.OrgMember],         Orgs.validators.validOrgNodeType);
mcnr.post("/nodes/:nid",       Orgs.addNodeToOrg,   [Access.OrgEditor],         Orgs.validators.validOrgNodeType);
mcnr.get("/nodes/:nid",        Orgs.getOrgNode,     [Access.OrgMember],         Orgs.validators.validOrgNodeType);

// orgItemRouter.post(
//   "/",
//   (req: Request, res: Response) => {
//     switch (req.params.type) {
//       case NodeType.User:
//         res.locals.relationshipBody = { role: OrgRole.Viewer };
//     }
//   },
//   addItemToOrg
// );

// AUTH -------------------------------------------------------------------------------------------
// mcnr.post("/auth/keys",             Auth.generateKey,   [Access.Authenticated]);
// mcnr.post("/auth/keys/jwt",         Auth.generateJwt,   [Access.Authenticated]);
// mcnr.get("/auth/keys/jwt/validate", Auth.validateJwt,   [Access.Authenticated]);
// mcnr.get("/auth/verify",            Auth.verifyEmail,   [Access.None], Auth.validators.verify);
//   validate([
//     query("email")
//       .isEmail()
//       .normalizeEmail()
//       .withMessage("not a valid email address"),
//     query("hash")
//       .not()
//       .isEmpty()
//       .trim()
//       .withMessage("must have a verification hash"),
//   ]),


// IoT -------------------------------------------------------------------------------------------
mcnr.get("/iot/time", IoT.getUnixEpoch, [Access.None]);
// //seconds since unix epoch
// router.get("/time", (req: Request, res: Response) => {
//   const now = new Date();
//   return res.status(HTTP.OK).send(Math.round(now.getTime() / 1000));
// });

// TEST -------------------------------------------------------------------------------------------
mcnr.post("/test/drop", async () => {
    await cypher(`MATCH (n) DETACH DELETE n`, {});
    return;
}, [Access.SiteAdmin]);
  
export default mcnr;
