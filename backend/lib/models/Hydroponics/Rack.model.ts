import {
  IRecordable,
  RecordableType,
  IRecordableStub,
} from "./Recordable.model";

export interface IRack extends IRecordable {
  type: RecordableType.Rack;
  children: IRecordableStub[];
  created_at?: Date;
}
