import { INode } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export interface IYield extends INode {
  input_weight: number;
  output_weight: number;
}
