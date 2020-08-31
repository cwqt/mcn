import { NodeType } from "./Types/Nodes.types";

export type Primitive = string | boolean | number;
export type Idless<T> = Omit<T, "_id">;

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

export interface IGraphNode {
  name: string;
  _id: string;
  type: NodeType;
}

export interface IFlatNodeGraph {
  //farm-as47wic...etc
  sources: { [source: string]: { name: string } };
  data: IFlatNodeGraphItem[];
}

export interface IFlatNodeGraphItem {
  from: string;
  to: string;
  custom: { [index: string]: Primitive };
}
