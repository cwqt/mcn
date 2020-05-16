export interface IUserStub {
    _id:            string,
    username:       string,
    name?:          string,
    avatar?:        string,
}

export interface IUser extends IUserStub {
    email:          string,
    verified:       boolean,
    new_user:       boolean,
    admin?:         boolean,
    bio?:           string,
    cover_image?:   string,
    location?:      string,
    created_at?:    number,
}

export interface IUserPrivate extends IUser {
    salt?:          string,
    pw_hash?:       string,
}

// collected meta-data
export interface IUserFE extends IUser {
    plants:         number,
    gardens:        number,
    devices:        number,
    followers:      number,
    following:      number,
    hearts:         number,
    posts:          number,
}