import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model"

export interface IGarden extends IRecordable {
    type:           RecordableType.Plant,
    species:        string,
    children:       IRecordableStub[],
    created_at?:    Date,
    updated_at?:    Date
}
