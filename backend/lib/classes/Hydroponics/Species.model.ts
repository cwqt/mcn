import { Schema } from "mongoose";
const mongoose = require("mongoose");
import {
  ISpeciesStub,
  GrowthPhase,
  ISpeciesModel,
  ISpecies,
  DataModel,
  ISpeciesMongo,
  NodeType,
} from "@cxss/interfaces";
import { MSchemas } from "../../common/dbs";
import Node from "../Node.model";
import { Types } from "mongoose";
const Species = MSchemas.Species;

type TSpecies = ISpeciesStub | ISpecies | ISpeciesModel;

const create = async (data: ISpecies, creator_id: string): Promise<ISpeciesModel> => {
  let species = await Species.create({ ...data, creator_id: creator_id });
  species._id = species._id.toString();

  //create the cypher node now
  await Node.create(NodeType.Species, { _id: species._id }, creator_id);
  return reduce<ISpeciesModel>(species);
};

const read = async <T extends TSpecies>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  return reduce<T>(await Species.findById(_id), dataModel);
};

const reduce = <K extends TSpecies>(data: TSpecies, dataModel: DataModel = DataModel.Stub): K => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: ISpeciesStub = {
        ...Node.reduce(data),
        name: data.name,
        scientific_name: data.scientific_name,
      };
      return r as K;
    }

    case DataModel.Full: {
      let r: ISpeciesMongo = {
        ...reduce(data, DataModel.Stub),
        conditions: (<ISpecies>data).conditions,
        grow_period: (<ISpecies>data).grow_period,
        creator_id: (<ISpeciesMongo>data).creator_id,
      };
      return r as K;
    }
  }
};

const remove = async (_id: string) => {
  // Delete mongo & cypher reference
  await Promise.all([
    Species.findOneAndDelete(new Types.ObjectId(_id)),
    Node.remove(_id, NodeType.Species),
  ]);
};

export default { create, read, reduce, remove };
