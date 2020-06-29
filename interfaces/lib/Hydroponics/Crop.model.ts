import { INode } from "../Node.model";
import { GrowthPhase } from "../Types/Phases.types";

export interface ICrop extends INode {
  // type: RecordableType;
  species: string;
  phase?: GrowthPhase;
}
