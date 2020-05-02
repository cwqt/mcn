import { RecordableTypes } from "./Recordable.model";

export interface IApiKey {
    _id:        string,
    key:        string;
    type:       RecordableTypes;
    created_at: Date;
}