import { Request, Response } from "express";
import { ErrorHandler } from "../common/errorHandler";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";
import { Types } from "mongoose";

import { IOrgStub } from "../models/Orgs.model";

enum Role {
  Owner,
  Admin,
  Viewer,
}

export const createOrg = async (req: Request, res: Response) => {
  const org: IOrgStub = {
    _id: Types.ObjectId().toHexString(),
    name: req.body.name,
    created_at: Date.now(),
  };

  let result = await cypher(
    `
        MATCH (u:User {_id:$uid})
        CREATE (o:Organisation $org)<-[:CREATED]-(u)
        CREATE (o)<-[:MEMBER_OF {role: $role}]-(u)
        RETURN o
    `,
    {
      org: org,
      uid: req.session.user.id,
      role: Role.Owner,
    }
  );

  res.status(HTTP.Created).json(result.records[0].get("o").properties);
};
