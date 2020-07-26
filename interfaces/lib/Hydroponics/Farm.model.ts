import { IRecordable } from "./Recordable.model";
import { IRackStub } from "./Rack.model";
import { Paginated } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export interface IFarmStub extends IRecordable {
  _id: string;
  location: string; //lat/long
}

export interface IFarm extends IFarmStub {
  racks: Paginated<IRackStub> | number;
}
