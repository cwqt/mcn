import { Request, Response } from "express";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";
import { Types } from "mongoose";

import { IOrgStub, Org } from "../models/Orgs.model";
import { IDeviceStub } from "../models/IoT/Device.model";
import { OrgRole } from "../models/Node.model";

export const createOrg = async (req: Request, res: Response) => {
  const org = new Org(req.body.name);
  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        CREATE (o:Organisation $org)<-[:CREATED]-(u)
        CREATE (o)<-[:IN {role: $role}]-(u)
        RETURN o
    `,
    {
      org: org.toOrg(),
      uid: req.session.user.id,
      role: OrgRole.Owner,
    }
  );

  res.status(HTTP.Created).json(result.records[0].get("o").properties);
};

export const readOrgDevices = async (req: Request, res: Response) => {
  let result = await cypher(
    `
    MATCH (o:Org {_id:$oid})
    MATCH (d:Device)-[:IN]->(o)
    RETURN d
  `,
    {
      oid: req.params.oid,
    }
  );

  let devices: IDeviceStub[] = result.records.map(
    (r: any): IDeviceStub => {
      let d = r.get("d");
      return {
        _id: d._id,
        name: d.name,
        state: d.state,
        hardware_model: d.hardware_model,
        network_name: d.network_name,
      };
    }
  );

  res.json(devices);
};

export const readOrgUsers = async (req: Request, res: Response) => {};
