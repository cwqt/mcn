import { NodeType } from "./Types/Nodes.types";

export interface INode {
  _id: string;
  created_at: number;
  type: NodeType;
}

export interface Paginated<T> {
  results: T[];
  next: string;
  prev: string;
  total: number;
  pages: number;
}
