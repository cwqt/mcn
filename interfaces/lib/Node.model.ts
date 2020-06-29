import { NodeType } from "./Types/Nodes.types";

export interface INode {
  _id: string;
  created_at: number;
  type: NodeType;
}
