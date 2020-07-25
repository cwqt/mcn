import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model";
import { ICropStub } from "./Crop.model";
import { Paginated } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export interface IRackStub extends IRecordable {
  type: NodeType.Rack;
  crops: Paginated<ICropStub>;
}

export interface IRack extends IRackStub {}
