import { NodeType, IFarm, IFarmStub, IRackStub, Paginated } from "@cxss/interfaces";
import { Recordable } from "./Recordable.model";

export class Farm extends Recordable {
  location: string;
  racks?: Paginated<IRackStub>;

  constructor(name: string) {
    super(NodeType.Farm, name);
    this.images = [];
  }

  toStub(): IFarmStub {
    return {
      ...super.toFull(),
      name: this.name,
      location: this.location,
    };
  }

  toFull(): IFarm {
    return {
      ...this.toStub(),
      images: this.images,
      racks: this.racks,
    };
  }
}
