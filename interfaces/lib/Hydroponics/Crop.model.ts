import { INode } from "../Node.model";
import { GrowthPhase } from "../Types/Phases.types";
import { IRecordable } from "./Recordable.model";
import { ISpeciesStub } from "./Species.model";
import { NodeType } from "../Types/Nodes.types";

export interface ICropStub extends IRecordable {
  species: ISpeciesStub;
  phase?: GrowthPhase;
}

export interface ICrop extends ICropStub {}
