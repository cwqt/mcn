import { NodeType } from "./Types/nodes.types";

export interface INode {
  _id: string;
  created_at: number;
  type: NodeType;
}
