import { INode, Paginated } from "../Node.model";
import { IYield } from "./Recipe.model";
import { ITaskSeries } from "../Runner/Tasks.model";
import { NodeType } from "../Types/Nodes.types";

export interface ISpeciesStub extends INode {}

export interface ISpecies extends ISpeciesStub {
  yields: Paginated<IYield>;
  task_series: Paginated<ITaskSeries>;
}
