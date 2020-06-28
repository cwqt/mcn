import { INode, Node, NodeType } from "./Node.model";

export class Org extends Node {
  name: string;
  avatar?: string;

  constructor(name: string, _id?: string) {
    super(NodeType.Organisation, _id);
    this.name = name;
  }

  toStub(): IOrgStub {
    return {
      ...super.toStub(),
      name: this.name,
      avatar: this.avatar,
    };
  }

  toOrg(): IOrg {
    return {
      ...this.toStub(),
    };
  }
}

export interface IOrgStub extends INode {
  name: string;
  avatar?: string;
}

export interface IOrg extends IOrgStub {}
