import { INode } from "../Node.model";

export interface IYield extends INode {
  input_weight: number;
  output_weight: number;
}
