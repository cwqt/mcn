import { Request } from "express";
const { body } = require("express-validator");
import { validate } from "../../common/validate";

import { NodeType, IRackStub, IRack, ICropStub, DataModel } from "@cxss/interfaces";
import { Types } from "mongoose";
import Rack from "../../classes/Hydroponics/Rack.model";
import { cypher } from "../../common/dbs";
import { Record } from "neo4j-driver";
import Crop from "../../classes/Hydroponics/Crop.model";

export const validators = {
  createRack: validate([body("name").not().isEmpty().trim().withMessage("Rack must have a name")]),
};

export const createRack = async (req: Request): Promise<IRack> => {
  let rack: IRackStub = {
    _id: new Types.ObjectId().toHexString(),
    created_at: Date.now(),
    name: req.body.name,
    type: NodeType.Rack,
    images: [],
    crops: [],
  };

  return await Rack.create(rack, req.params.fid, req.session.user._id);
};

export const readRackCrops = async (req: Request): Promise<ICropStub[]> => {
  const res = await cypher(
    ` MATCH (r:Rack {_id:$rid})
      MATCH (c:Crop)-[:IN]->(r)
      RETURN c{._id}`,
    { rid: req.params.rid }
  );

  const crops: ICropStub[] = await Promise.all(
    res.records.map((r: Record) => {
      return Crop.read<ICropStub>(r.get("c")._id, DataModel.Stub);
    })
  );

  return crops;
};
