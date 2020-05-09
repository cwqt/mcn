import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model"

export interface IPlant extends IRecordable {
    type:           RecordableType.Plant,
    species:        string,
    garden?:        IRecordableStub,
    date_added?:    Date, //when added to garden
    created_at?:    Date,
    updated_at?:    Date
}
