import bcrypt                               from "bcrypt"
import { Request, Response, NextFunction }  from "express"

import { sendVerificationEmail }    from "./Email.controller";
import { ErrorHandler }             from '../common/errorHandler';
import { HTTP }                     from '../common/http';
import config                       from '../config';
import { uploadImageToS3, S3Image } from '../common/storage';
import { n4j }                      from '../common/neo4j';
import { Types }                    from 'mongoose';

import {
    IUserStub,
    IUser,
    IUserPrivate } from "../models/User.model";

export const filterUserFields = (user:any, toStub?:boolean):IUser | IUserStub => {
    let hiddenFields = ["_labels", "pw_hash", "salt"];
    if(toStub) hiddenFields = hiddenFields.concat(['email', 'admin', 'new_user', 'created_at', 'verified'])

    hiddenFields.forEach(field => delete user[field]);
    return user;
}

export const readAllUsers = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        let result = await session.run(`
            MATCH (u:User)
            RETURN u
        `)

        let users:IUser[] = result.records.map((record:any) => filterUserFields(record.get('u').properties));
        res.json(users);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }
}

export const createUser = async (req:Request, res:Response) => {
    //see if username/email already taken
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`MATCH (u:User) WHERE u.email = $email OR u.username = $username RETURN u`, {
            email: req.body.email,
            username: req.body.username
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    }

    if(result.records.length) {
        let errors = [];
        let user = result.records[0].get('u').properties;
        if(user.username == req.body.username) errors.push({param:"username", msg:"username is taken"});
        if(user.email == req.body.email) errors.push({param:"email", msg:"email already in use"});
        throw new ErrorHandler(HTTP.Conflict, errors);
    }

    let emailSent = await sendVerificationEmail(req.body.email);
    if(!emailSent) throw new ErrorHandler(HTTP.ServerError, 'Verification email could not be sent');

    //generate password hash
    let salt    = await bcrypt.genSalt(10);
    let pw_hash = await bcrypt.hash(req.body["password"], salt);

    let user:IUserPrivate = {
        _id:           Types.ObjectId().toHexString(),
        username:      req.body.username,
        email:         req.body.email,
        verified:      false,
        new_user:      true,
        salt:          salt,
        pw_hash:       pw_hash,
        admin:         false,
        created_at:    Date.now(),
    }

    try {
        let result = await session.run(`
            CREATE (u:User $body)
            RETURN u`,
        { body: user });

        let u = filterUserFields(result.records[0].get('u').properties) as IUser;
        res.status(HTTP.Created).json(u);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }
}

export const getUserById = async (_id:string):Promise<IUser> => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$_id})
            WITH u,
                size((u)-[:LIKES]->(:Post)) as hearts,
                size((u)-[:FOLLOWS]->(:User)) as following,
                size((u)<-[:FOLLOWS]-(:User)) as followers,
                size((u)-[:POSTED]->(:Post)) as posts
            RETURN u, {hearts:hearts, following:following, followers:followers, posts:posts} AS meta
        `, {
            _id: _id
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError)
    } finally {
        session.close();
    }

    let r = result.records[0];
    if(!r || r.get('u') == null) throw new ErrorHandler(HTTP.NotFound, "No such user exists");

    let user = r.get('u').properties;
    user.meta = {
        hearts:     r.get('meta').hearts.toNumber(),
        following:  r.get('meta').following.toNumber(),
        followers:  r.get('meta').followers.toNumber(),
        posts:      r.get('meta').posts.toNumber()    
    }

    return filterUserFields(user) as IUser;
}

export const readUserById = async (req:Request, res:Response, next:NextFunction) => {
    res.json(await getUserById(req.params.uid));
}

export const readUserByUsername = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {username: $username})
            RETURN u
        `, { username: req.params.username })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError)
    } finally {
        session.close()
    }

    let r = result.records[0];
    if(!r || r.get('u') == null) throw new ErrorHandler(HTTP.NotFound, "No such user exists");
    res.json(await getUserById(r.get('u').properties._id))
}

export const updateUser = async (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    let allowedFields = ["name", "email", "location", "bio", "new_user"];
    let reqKeys = Object.keys(req.body);
    for(let i=0; i<reqKeys.length; i++) {
        if(!allowedFields.includes(reqKeys[i])) continue;
        newData[reqKeys[i]] = req.body[reqKeys[i]];
    }

    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})
            SET u += $body
            RETURN u
        `, {
            uid: req.params.uid,
            body: newData
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let user = result.records[0].get('u').properties
    res.json(filterUserFields(user));
}

const updateImage = async (user_id:string, file:Express.Multer.File, field:string) => {
    let image:S3Image;
    try {
        image = await uploadImageToS3(user_id, file, field) as S3Image;
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }

    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id: "${user_id}"})
            SET u.${field} = '${image.data.Location}'
            RETURN u
        `, {})
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    return filterUserFields(result.records[0].get('u').properties);
}

export const updateUserAvatar = async (req:Request, res:Response, next:NextFunction) => {
    try {
        let user = await updateImage(req.params.uid, req.file, 'avatar');
        res.json(user);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const updateUserCoverImage = async (req:Request, res:Response, next:NextFunction) => {
    try {
        let user = await updateImage(req.params.uid, req.file, 'cover_image');
        res.json(user);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const deleteUser = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        await session.run(`
            MATCH (u:User {_id:$uid})
            DETACH DELETE u
        `, {
            uid: req.params.uid
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    res.status(HTTP.OK).end();
}

export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    let email = req.body.email;
    let password = req.body.password;

    //find user by email
    let result;
    let session = n4j.session()
    try {
        result = await session.run(`MATCH (u:User {email: $email}) RETURN u`, {email:email})
        if(!result.records.length) next(new ErrorHandler(HTTP.NotFound, [{param:'email', msg:'No such user for this email'}]));
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    let user:IUserPrivate = result.records[0].get('u').properties;
    if(!user.verified) next(new ErrorHandler(HTTP.Unauthorised, [{param:'form', msg:'Your account has not been verified'}]));

    try {
        let match = await bcrypt.compare(password, user.pw_hash);
        if(!match) next( new ErrorHandler(HTTP.Unauthorised, [{param:'password', msg:'Incorrect password'}]));

        req.session.user = {
            id: user._id,
            admin: user.admin || false
        }

        user = await getUserById(user._id) as IUser;
        res.json(filterUserFields(user));    
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const logoutUser = (req:Request, res:Response, next:NextFunction) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) return next(new ErrorHandler(HTTP.ServerError, 'Logging out failed'))
            res.status(HTTP.OK).end()
        })
    }
}

export const blockUser = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();

    try {
        await session.run(`
            MATCH (u1:User {_id:$uid1}), (u2:User {_id:$uid2})
            OPTIONAL MATCH (u1)-[r:FOLLOWS]-(u2)
            DELETE r
            MERGE (u1)-[:BLOCKS]->(u2)
        `, {
            uid1: req.session.user.id,
            uid2: req.params.uid2
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }
    res.status(HTTP.OK).end();
}

export const unblockUser = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        await session.run(`
            MATCH (:User {_id:$uid1})-[r:BLOCKS]->(:User {_id:$uid2})
            DELETE r
        `, {
            uid1: req.session.user.id,
            uid2: req.params.uid2
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }
    res.status(HTTP.OK).end();
}

export const followUser = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        let result = await session.run(`
            MATCH (u1:User { _id: $uid1 }), (u2:User { _id: $uid2 })
            OPTIONAL MATCH (u1)-[blocked:BLOCKS]-(u2)
            return u1, u2, blocked
        `, {
            uid1: req.session.user.id,
            uid2: req.params.uid2
        })

        if(result.records[0].get('blocked') != null) {
            throw new ErrorHandler(HTTP.Unauthorised, "Can't follow blocked user");
        }

        await session.run(`
            MATCH (u1:User { _id: $uid1 }), (u2:User { _id: $uid2 })
            MERGE (u1)-[:FOLLOWS]->(u2)
        `, {
            uid1: req.session.user.id,
            uid2: req.params.uid2,
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    res.status(HTTP.OK).end();
}

export const unfollowUser = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session()
    try {
        await session.run(`
            MATCH (:User { _id: $uid1 })-[r:FOLLOWS]->(:User { _id: $uid2 })
            DELETE r
        `, {
            uid1: req.session.user.id,
            uid2: req.params.uid2
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    res.status(HTTP.OK).end();
}

export const readFollowers = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        let result = await session.run(`
            MATCH (follower:User)-[:FOLLOWS]->(u:User {_id:$uid})
            RETURN follower
        `, {
            uid: req.params.uid
        })

        let followers = result.records.map((record:any) => filterUserFields(record.get('follower').properties));
        res.json(followers)
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }
}

export const readFollowing = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        let result = await session.run(`
            MATCH (follower:User)<-[:FOLLOWS]-(u:User {_id:$uid})
            RETURN follower
        `, {
            uid: req.params.uid
        })

        let followers = result.records.map((record:any) => filterUserFields(record.get('follower').properties));
        res.json(followers)
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }
}

export const readBlockedUsers = async (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    try {
        let result = await session.run(`
            MATCH (blockee:User)<-[:BLOCKS]-(u:User {_id:$uid})
            RETURN blockee
        `, {
            uid: req.params.uid
        })

        let blockees = result.records.map((record:any) => filterUserFields(record.get('blockee').properties));
        res.json(blockees)
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }
}
