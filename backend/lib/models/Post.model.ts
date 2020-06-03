import { IRecordableStub, RecordableType } from "./Recordable.model";
import { IDeviceStub, IDevice } from "./Device/Device.model";
import { IUserStub } from './User.model';
import { RecorderType } from "./Measurement.model";

export type Postable = IPostStub | IDeviceStub | IRecordableStub;

export enum PostableType {
    Post    = 'post',
    Device  = 'device', // RecordableType.Device
    Plant   = 'plant',  // RecordableType.Plant
    Garden  = 'garden'  // RecordableType.Garden
}

export enum RepostType {
    Post = 'repost-post',
    Device = 'repost-device',
    Recordable = 'repost-recordable'
}

export interface IRepost {
    author: IUserStub,
    content: IPostStub | IRecordableStub | IDeviceStub,
    type: RepostType
}

//relative to user session
export interface IPostableMeta {
    hearts:        number,
    replies:       number,
    reposts:       number,
    isHearting:    boolean,
    hasReposted:   boolean
}

export interface IPostStub {
    _id:            string,
    content:        string,
    images?:        string[],
    created_at?:    number,
    repost?:        IRepost
    meta?:          IPostableMeta
}

export interface IPost extends IPostStub {
}