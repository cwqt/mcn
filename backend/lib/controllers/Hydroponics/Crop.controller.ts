import { Request } from "express";
const { body } = require("express-validator");
import { validate } from "../../common/validate";

import { NodeType, IRack, ICropStub, DataModel, GrowthPhase, ICrop } from "@cxss/interfaces";
import { Types } from "mongoose";
import Crop from "../../classes/Hydroponics/Crop.model";
import { cypher } from "../../common/dbs";
import { Record } from "neo4j-driver";

export const validators = {
  createCrop: validate([body("name").not().isEmpty().trim().withMessage("Crop must have a name")]),
};

export const createCrop = async (req: Request): Promise<ICrop> => {
  let crop: ICropStub = {
    _id: new Types.ObjectId().toHexString(),
    created_at: Date.now(),
    name: req.body.name,
    species: req.body.species,
    type: NodeType.Rack,
    images: [],
    phase: GrowthPhase.Seedling,
  };

  return await Crop.create(crop, req.params.rid, req.session.user._id);
};
