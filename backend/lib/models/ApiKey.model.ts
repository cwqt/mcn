import { RecordableTypes } from "./Recordable.model";

export interface IApiKey {
    _id:        string,
    key:        string,
    key_name:   string,
    type:       RecordableTypes,
    created_at: number;
}