import { IRecordable, RecordableTypes, IRecordableStub } from "./Recordable.model"

export interface IGarden extends IRecordable {
    type:           RecordableTypes.Plant,
    species:        string,
    children:       IRecordableStub[],
    created_at?:    Date,
    updated_at?:    Date
}
