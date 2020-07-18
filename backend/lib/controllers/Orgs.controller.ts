import { Request, Response } from "express";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";

import { objToClass } from "../classes/Node.model";
import { Org } from "../classes/Orgs.model";
import { OrgRole, NodeType, OrgItemType } from "@cxss/interfaces";
import { capitalize } from "./Node.controller";
import { ErrorHandler } from "../common/errorHandler";
const { body, param, query } = require("express-validator");
import { validate } from "../common/validate";

export const validators = {
  createOrg: validate([body("name").not().isEmpty().trim()]),
  validOrgNodeType: validate([query("type").isIn(Object.values(OrgItemType))]),
};

export const createOrg = async (req: Request) => {
  const org = new Org(req.body.name);
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        CREATE (o:Organisation $org)<-[:CREATED]-(u)
        CREATE (o)<-[:IN {role: $role}]-(u)
        RETURN o
    `,
    {
      org: org.toFull(),
      uid: req.session.user.id,
      role: OrgRole.Owner,
    }
  );

  return org.toFull();
};

export const getOrgNode = async (req: Request) => {
  let nodeType = <string>req.query.type;
  let result = await cypher(
    `
      MATCH (o:Organisation {_id:$oid})
      MATCH (n:${capitalize(nodeType)} {_id:$iid})-[:IN]->(o)
      RETURN n
    `,
    {
      oid: req.params.org_id,
      iid: req.params.iid,
    }
  );

  if (!result.records.length) throw new ErrorHandler(HTTP.NotFound, `No such ${nodeType}`);
  let node = objToClass(<NodeType>nodeType, result.records[0].get("n").properties).toDevice();
  return node;
};

export const readOrgNodes = async (req: Request) => {
  let nodeType = <string>req.query.type;
  let result = await cypher(
    `
      MATCH (o:Organisation {_id:$oid})
      MATCH (n:${capitalize(nodeType)})-[:IN]->(o)
      RETURN n
    `,
    {
      oid: req.params.org_id,
    }
  );

  console.log(result, nodeType, req.params.org_id);

  let nodes = result.records.map((r: any) => {
    return objToClass(<NodeType>nodeType, r.get("n").properties).toStub();
  });

  return nodes;
};

export const addNodeToOrg = async (req: Request) => {
  let nodeType = <string>req.query.type;
  let result = await cypher(
    `
        MATCH (o:Organisation {_id:$oid})
        MATCH (n:${capitalize(nodeType)} {_id:$iid})
        WHERE NOT (n)-[:IN]->(o)
        CREATE (n)-[:IN $rbody]->(o)
      `,
    {
      oid: req.params.org_id,
      iid: req.params.iid,
      rbody: res.locals.relationshipBody ?? {},
    }
  );

  res.status(HTTP.OK).end();
};

// export const getItem = async (node:NodeType, org_id?:string) => {
//   return async (req:Request, res:Response) => {
//     let result = await cypher(
//       `
//         MATCH (o:Organisation {_id:$oid})
//         MATCH (n:${capitalize(node)} {_id:$iid})-[:IN]->(o)
//         RETURN n
//       `,
//       {
//         oid: org_id,
//         iid: req.params.iid,
//       }
//     );

//     if (!result.records.length) throw new ErrorHandler(HTTP.NotFound, `No such ${nodeType}`);
//     let node = objToClass(<NodeType>nodeType, result.records[0].get("n").properties).toFull();
//     res.json(node);
//   }
// }
