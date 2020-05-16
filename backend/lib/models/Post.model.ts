import { IRecordableStub } from "./Recordable.model";
import { IDeviceStub } from "./Device.model";
import { IUserStub } from './User.model';

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