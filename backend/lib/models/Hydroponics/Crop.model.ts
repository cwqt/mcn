import { IRecordable, RecordableType, IRecordableStub } from "../Recordable.model";
import { GrowthPhase } from "../../common/types/phases.types";

export interface ICrop extends IRecordable {
  type: RecordableType.Crop;
  species: string;
  garden?: IRecordableStub;
  phase?: GrowthPhase;
  date_added?: Date; //when added to garden
  created_at?: Date;
  updated_at?: Date;
}
