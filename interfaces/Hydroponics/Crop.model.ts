import { RecordableType, INode } from "../Node.model";
import { GrowthPhase } from "../../common/types/phases.types";

export interface ICrop extends INode {
  type: RecordableType;
  species: string;
  phase?: GrowthPhase;
}
