import { Document } from "mongoose";
import { INode } from "../Node.model";
import { GrowthPhase } from "../Types/Phases.types";
import { Measurement } from "../Types/Measurements.types";

export interface ISpeciesStub extends INode {
  name: string;
  scientific_name: string;
}

//conditions dictate maximum bounds for environment during each phase
//task routine provides greater granularity for pid control
export interface ISpecies extends ISpeciesStub {
  name: string;
  scientific_name: string;
  conditions: { [index in GrowthPhase]: { [index in Measurement]?: [number, number, number] } };
  grow_period: number; //days
}

import { Schema } from "mongoose";
export const speciesSchema = new Schema({
  name: String,
  scientific_name: String,
  conditions: Object,
  grow_period: Number,
});

export interface ISpeciesModel extends Omit<ISpecies, "_id">, Document {
  save: () => Promise<this>;
}
