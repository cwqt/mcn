import { Request, Response, NextFunction } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";

import { HTTP } from "../../common/http";
import dbs, { cypher } from "../../common/dbs";
import { ErrorHandler } from "../../common/errorHandler";
import { Paginated, IFarm, IFarmStub, NodeType, DataModel, IRackStub } from "@cxss/interfaces";
// import { Farm } from "../../classes/Hydroponics/Farm.model";
import { paginate } from "../Node.controller";
import { IResLocals } from "../../mcnr";
import { Types } from "mongoose";
import { Record } from "neo4j-driver";
import Farm from "../../classes/Hydroponics/Farm.model";
import Rack from "../../classes/Hydroponics/Rack.model";

export const validators = {
  createFarm: validate([body("name").not().isEmpty().trim().withMessage("Farm must have a name")]),
};

export const readAllFarms = async (
  req: Request,
  next: NextFunction,
  locals: IResLocals
): Promise<Paginated<IFarmStub>> => {
  return paginate(NodeType.Farm, [], 0, locals.pagination.per_page);
};

export const createFarm = async (req: Request): Promise<IFarm> => {
  let farm: IFarmStub = {
    _id: new Types.ObjectId().toHexString(),
    created_at: Date.now(),
    racks: 0,
    name: req.body.name,
    type: NodeType.Farm,
    images: [],
  };

  return await Farm.create(farm, req.session.user._id);
};

export const readFarm = async (req: Request): Promise<IFarm> => {
  let farm: IFarm = await Farm.read(req.params.fid, DataModel.Full);
  return farm;
};

export const readFarmRacks = async (req: Request): Promise<IRackStub[]> => {
  const res = await cypher(
    ` MATCH (f:Farm {_id:$fid})
      MATCH (r:Rack)-[:IN]->(f)
      RETURN r{._id}`,
    { fid: req.params.fid }
  );

  let racks: IRackStub[] = await Promise.all(
    res.records.map((r: Record) => {
      return Rack.read<IRackStub>(r.get("r")._id, DataModel.Stub);
    })
  );

  return racks;
};
