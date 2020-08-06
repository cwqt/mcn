import { INode, Paginated } from "../Node.model";
import { IYield } from "./Recipe.model";
import { ITaskSeries } from "../Runner/Tasks.model";
import { NodeType } from "../Types/Nodes.types";
import { GrowthPhase } from "../Types/Phases.types";
import { Measurement } from "../Types/Measurements.types";

export interface ISpeciesLinker {
  _id: string;
}

//conditions dictate maximum bounds for environment during each phase
//task routine provides greater granularity for pid control
export interface ISpeciesStub extends INode {
  _id: string;
  name: string;
  scientific_name: string;
  conditions: { [index in GrowthPhase]: { [index in Measurement]?: [number, number, number] } };
  grow_period: number; //days
}

// export interface ISpecies extends ISpeciesStub {
//   yields: Paginated<IYield>;
//   task_series: Paginated<ITaskSeries>;
// }
