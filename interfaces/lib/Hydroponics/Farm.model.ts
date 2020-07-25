import { IRecordable } from "./Recordable.model";
import { IRackStub } from "./Rack.model";
import { Paginated } from "../Node.model";

export interface IFarmStub extends IRecordable {
  _id: string;
}

export interface IFarm extends IFarmStub {
  racks: Paginated<IRackStub>;
}
