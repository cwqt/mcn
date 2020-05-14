export interface IPostStub {
    _id:            string,
    content:        string,
    images?:        string[],
    created_at?:    number,
    repost?:        IPostStub
}

export interface IPost extends IPostStub {
    replies:        number,
    hearts:         number,
    reposts:        number,
    shares:         number,
    isHearting:     boolean,
    hasReposted:    boolean
}
