import { IOrg, NodeType, IOrgStub } from "@cxss/interfaces";
import { Stories } from "../stories";
import { expect } from "chai";
const fetch = require("node-fetch");

export const createOrg = async (org: { name: string }): Promise<IOrg> => {
  let res = await fetch(`${Stories.apiUrl}/orgs`, {
    method: "POST",
    body: JSON.stringify(org),
    // credentials: "include",
    headers: {
      ["Content-Type"]: "application/json",
      ["Cookie"]: Stories.activeSession,
    },
  });

  expect(res.status).to.be.eq(201);
  return await res.json();
};

export const getOrgs = async () => {};
export const deleteOrg = async () => {};
export const addUserToOrg = async () => {};
export const editUserRole = async () => {};

export const addNodeToOrg = async (org: IOrg | IOrgStub, nodeType: NodeType, data: any) => {
  let res = await fetch(`${Stories.apiUrl}/orgs/${org._id}/${nodeType}s/${data._id}`, {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
      ["Cookie"]: Stories.activeSession,
    },
  });

  expect(res.status).to.be.eq(201);
  return;
};

// mcnr.post("/orgs",                      Orgs.createOrg,           [Access.Authenticated],    Orgs.validators.createOrg);
// mcnr.get("/orgs",                       Orgs.getOrgs,             [Access.SiteAdmin]);

// mcnr.delete("/orgs/:oid",               Orgs.deleteOrg,           [Access.OrgAdmin]);

// // ORG USERS ---------------------------------------------------------------------------------
// mcnr.post("/orgs/:oid/users/:iid",      Orgs.addNodeToOrg(NodeType.User),   [Access.OrgEditor]);
// mcnr.put("/orgs/:oid/users/:uid/role",  Orgs.editUserRole,                  [Access.OrgAdmin]);

// // ORG DEVICES -------------------------------------------------------------------------------
// mcnr.post("/orgs/:oid/devices/:iid",   Orgs.addNodeToOrg(NodeType.Device), [Access.OrgEditor]);
// mcnr.get("/orgs/:oid/devices",         Orgs.getNodes(NodeType.Device),     [Access.OrgMember]);
