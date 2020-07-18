import { INode, NodeType, IOrg, IOrgStub } from "@cxss/interfaces";
import { Node } from "./Node.model";

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

  toFull(): IOrg {
    return {
      ...this.toStub(),
    };
  }
}
