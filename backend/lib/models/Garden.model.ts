import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model"

export interface IGarden extends IRecordable {
    type:           RecordableType.Garden,
    children:       IRecordableStub[],
    created_at?:    Date,
}
