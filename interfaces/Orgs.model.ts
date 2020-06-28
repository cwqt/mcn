import { INode } from "./Node.model";

export interface IOrgStub extends INode {
  name: string;
  avatar?: string;
}

export interface IOrg extends IOrgStub {}
