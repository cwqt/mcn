import { IRecordableStub } from "./Recordable.model";
import { IDeviceStub } from "./Device.model";

export interface IPostStub {
    _id:            string,
    content:        string,
    images?:        string[],
    created_at?:    number,
    repost?:        IPostStub | IRecordableStub | IDeviceStub
}

export interface IPostable {
    hearts?:        number,
    replies?:       number,
    reposts?:       number,
    isHearting?:    boolean,
    hasReposted?:   boolean
}

export interface IPost extends IPostStub, IPostable {
}
