export interface IPost {
    _id:            string,
    replies:        number,
    hearts:         number,
    reposts:        number,
    shares:         number,
    content:        string,
    images?:        string[],
    created_at?:    number,
    updated_at?:    number,
}
