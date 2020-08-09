import { Request, Response } from "express";
const { body } = require("express-validator");
import { validate } from "../../common/validate";

import {
  Idless,
  NodeType,
  IRackStub,
  IRack,
  ICropStub,
  DataModel,
  ISpecies,
  ISpeciesModel,
  ISpeciesStub,
} from "@cxss/interfaces";
import { Types } from "mongoose";
import Rack from "../../classes/Hydroponics/Rack.model";
import { cypher, MSchemas } from "../../common/dbs";
import { Record } from "neo4j-driver";
import Species from "../../classes/Hydroponics/Species.model";
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP } from "../../common/http";

const SpeciesModel = MSchemas.Species;

export const validators = {
  createSpecies: validate([
    body("name").not().isEmpty().trim().withMessage("Species must have a name"),
    body("scientific_name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Species must have a scientific name"),
  ]),
};

export const createSpecies = async (req: Request): Promise<ISpecies> => {
  let species: Idless<ISpecies> = {
    conditions: {},
    grow_period: req.body.grow_period,
    name: req.body.name,
    scientific_name: req.body.scientific_name,
    created_at: Date.now(),
    type: NodeType.Species,
  };

  return await Species.create(species, req.session.user._id);
};

export const search = async (req: Request) => {
  const query: string = req.query.query as string;
  if (!query.length) throw new ErrorHandler(HTTP.BadRequest, "No search query provided");

  const species: ISpeciesModel[] = await SpeciesModel.find({
    name: { $regex: `.*${query}*.`, $options: "i" },
  });

  return species.map((s: ISpeciesModel) => Species.reduce<ISpeciesStub>(s, DataModel.Stub));
};

export const readSpeciesTaskSeries = async (req: Request) => {};

export const readYields = async (req: Request) => {};

export const readSpecies = async (req: Request) => {};
