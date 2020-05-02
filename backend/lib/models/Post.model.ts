export interface IPost {
    _id:            string,
    replies:        number,
    hearts:         number,
    reposts:        number,
    shares:         number,
    content:        string,
    images?:        string[],
    created_at?:    Date,
    updated_at?:    Date,
}
