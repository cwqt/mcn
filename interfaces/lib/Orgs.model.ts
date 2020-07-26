import { INode } from "./Node.model";
import { NodeType } from "./Types/Nodes.types";

export interface IOrgStub extends INode {
  name: string;
  avatar?: string;
}

export interface IOrg extends IOrgStub {}
