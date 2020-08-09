import { Schema } from "mongoose";
const mongoose = require("mongoose");
import {
  ISpeciesStub,
  GrowthPhase,
  MongoISpecies,
  ISpeciesModel,
  ISpecies,
  DataModel,
  Idless,
  NodeType,
} from "@cxss/interfaces";
import { MSchemas } from "../../common/dbs";
import Node from "../Node.model";
import { Types } from "mongoose";

const Species = MSchemas.Species;
type TSpecies = ISpeciesStub | ISpecies | MongoISpecies;

const create = async (data: Idless<ISpecies>, creator_id: string): Promise<ISpecies> => {
  let species = await Species.create({ ...data, creator_id: creator_id });

  //create the cypher node now
  await Node.create(NodeType.Species, { _id: species._id.toString() }, creator_id);
  return reduce<ISpecies>(species, DataModel.Full);
};

// read from mongodb
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
      r._id = r._id.toString();
      return r as K;
    }

    case DataModel.Full: {
      let r: ISpecies = {
        ...reduce(data, DataModel.Stub),
        conditions: (<ISpecies>data).conditions,
        grow_period: (<ISpecies>data).grow_period,
      };
      return r as K;
    }

    case DataModel.Mongo: {
      let r: MongoISpecies = {
        ...reduce(data, DataModel.Full),
        creator_id: (<MongoISpecies>data).creator_id,
      };
      return r as K;
    }
  }
};

const remove = async (_id: string) => {
  // Delete mongo & cypher reference
  await Promise.all([
    Species.findOneAndDelete(new Types.ObjectId(_id)).exec(),
    Node.remove(_id, NodeType.Species),
  ]);
};

export default { create, read, reduce, remove };
