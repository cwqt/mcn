import { NodeType } from "../backend/lib/common/types/nodes.types";

export interface INode {
  _id: string;
  created_at: number;
  type: NodeType;
}
