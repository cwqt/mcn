import { IRecordable, RecordableType, IRecordableStub } from "./Recordable.model"
import { IPostableMeta } from "./Post.model";

export interface IGarden extends IRecordable {
    type:           RecordableType.Garden,
    children:       IRecordableStub[],
    created_at?:    Date,
}

export interface IGardenFE extends IGarden, IPostableMeta {

}