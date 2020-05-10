import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model";
import { GrowthPhase } from '../common/types/phases.types';

export interface IPlant extends IRecordable {
    type:           RecordableType.Plant,
    species:        string,
    garden?:        IRecordableStub,
    phase?:         GrowthPhase,
    date_added?:    Date, //when added to garden
    created_at?:    Date,
    updated_at?:    Date
}
