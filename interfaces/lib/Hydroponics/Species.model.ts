import { Document } from "mongoose";
import { INode, Idless } from "../Node.model";
import { GrowthPhase } from "../Types/Phases.types";
import { Measurement } from "../Types/Measurements.types";

export interface ISpeciesStub extends INode {
  name: string;
  scientific_name: string;
}

//conditions dictate maximum bounds for environment during each phase
//task routine provides greater granularity for pid control
export interface ISpecies extends ISpeciesStub {
  conditions: { [index in GrowthPhase]?: { [index in Measurement]?: [number, number, number] } };
  grow_period: number; //days
}

import { Schema } from "mongoose";
import { NodeType } from "../Types/Nodes.types";
export const speciesSchema = new Schema({
  name: String,
  created_at: Number,
  type: {
    type: String,
    enum: [...Object.values(NodeType)],
  },
  scientific_name: String,
  conditions: Object,
  grow_period: Number,
  creator_id: String,
});

export interface ISpeciesModel extends Idless<ISpecies>, Document {
  creator_id: string;
  save: () => Promise<this>;
}

export type MongoISpecies = Pick<ISpeciesModel, "creator_id"> & ISpecies;
