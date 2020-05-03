interface IRepost {
    
}

export interface IPostStub {
    _id:            string,
    replies:        number,
    hearts:         number,
    reposts:        number,
    shares:         number,
    content:        string,
    images?:        string[],
    created_at?:    number,
    repost?:        IRepost
}

export interface IPost extends IPostStub {
    replies:any;
}
