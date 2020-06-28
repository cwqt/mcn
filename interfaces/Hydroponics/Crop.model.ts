import { INode } from "../Node.model";
import { GrowthPhase } from "../Types/phases.types";

export interface ICrop extends INode {
  // type: RecordableType;
  species: string;
  phase?: GrowthPhase;
}
