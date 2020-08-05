import { Request, Response, NextFunction } from "express";
const { body, param, query } = require("express-validator");
import { validate } from "../../common/validate";

import { HTTP } from "../../common/http";
import dbs, { cypher } from "../../common/dbs";
import { ErrorHandler } from "../../common/errorHandler";
import { Paginated, IFarm, IFarmStub, NodeType } from "@cxss/interfaces";
// import { Farm } from "../../classes/Hydroponics/Farm.model";
import { paginate } from "../Node.controller";
import { IResLocals } from "../../mcnr";

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

// export const createFarm = async (req: Request): Promise<IFarm> => {
//   let farm: IFarm = await new Farm(req.body.name).create();
//   return farm;
// };

// export const readFarm = async (req: Request): Promise<IFarm> => {
//   let farm: Farm = await new Node(NodeType.Farm, req.params.fid).read();
//   return farm.toFull();
// };
