import { IRecordableStub } from "./Recordable.model";
import { IDeviceStub } from "./Device.model";
import { IUserStub } from './User.model';

export interface IRepost {
    author: IUserStub,
    content: IPostStub | IRecordableStub | IDeviceStub
}

export interface IPostStub {
    _id:            string,
    content:        string,
    images?:        string[],
    created_at?:    number,
    repost?:        IRepost
}

export interface IPost extends IPostStub {
}

//relative to user session
export interface IPostableMeta {
    hearts?:        number,
    replies?:       number,
    reposts?:       number,
    isHearting?:    boolean,
    hasReposted?:   boolean
}

export interface IPostFE extends IPost, IPostableMeta {

}