import bcrypt                                   from "bcrypt"
import { Request, Response, NextFunction }      from "express"

import { IUserModel }             from "../models/User.model"
import { sendVerificationEmail }        from "./Email.controller";
import { ErrorHandler }                 from '../common/errorHandler';
import { HTTP }                         from '../common/http';
import config                           from '../config';
import { uploadImageToS3, S3Image }     from '../common/storage';
import neode from '../common/neo4j';

const filterFields = (user:any) => {
    let hiddenFields = ["_labels", "pw_hash", "salt"];
    hiddenFields.forEach(field => delete user[field]);
    return user;
}

export const readAllUsers = async (req:Request, res:Response, next:NextFunction) => {
    const order_by = (req.query.order || 'title') as string;
    const sort = (req.query.sort || 'ASC') as string;
    const limit = (req.query.limit || 10) as number;
    const page = (req.query.page || 1) as number;
    const skip = (page-1) * limit;

    const params = {};
    const order = {[order_by]: sort};

    let u = await neode.instance.all('User', params, order , limit, skip);
    let users:any = u.map(user => filterFields(user.properties()));
    res.json(users);
}

export const createUser = async (req:Request, res:Response, next:NextFunction) => {
    //see if username/email already taken
    let result = await neode.instance.cypher(`MATCH (u:User) WHERE u.email = $email OR u.username = $username RETURN u`, {
        email: req.body.email,
        username: req.body.username
    })

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
    req.body["salt"] = await bcrypt.genSalt(10);
    req.body["pw_hash"] = await bcrypt.hash(req.body["password"], req.body["salt"]);
    delete req.body["password"];

    let created_user = (await neode.instance.create('User', req.body)).properties();
    res.status(HTTP.Created).json(filterFields(created_user));
}

export const readUserById = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (u:User {_id:$_id})
        WITH u, 
            count((u)-[:LIKES]->()) as hearts,
            count((u)-[:FOLLOWS]->()) as following,
            count((u)<-[:FOLLOWS]-()) as followers,
            count((u)-[:CREATED]->(:Post)) as posts
        RETURN u, {hearts:toFloat(hearts), following:toFloat(following), followers:toFloat(followers), posts:toFloat(posts)} AS meta
    `, {
        _id: req.params.uid
    })

    let r = result.records[0];
    if(!r || r.get('u') == null) throw new ErrorHandler(HTTP.NotFound, "No such user exists");

    res.json(filterFields({...r.get('u').properties, ...r.get('meta')}));
}

export const readUserByUsername = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`MATCH (u:User {username: $username}) RETURN u`, {
        username: req.params.username
    })

    if(!result.records[0]) throw new ErrorHandler(HTTP.NotFound, "No such user exists");
    let user = result.records[0].get('u').properties;
    res.json(filterFields(user));
}

export const updateUser = async (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    let allowedFields = ["name", "email", "location", "bio", "new_user"];
    let reqKeys = Object.keys(req.body);
    for(let i=0; i<reqKeys.length; i++) {
        if(!allowedFields.includes(reqKeys[i])) continue;
        newData[reqKeys[i]] = req.body[reqKeys[i]];
    }

    let u = await neode.instance.find('User', req.params.uid);
    if(!u) throw new ErrorHandler(HTTP.NotFound, "No such user exists");

    let user = (await u.update(newData)).properties();
    res.json(filterFields(user));
}

const updateImage = async (user_id:string, file:Express.Multer.File, field:string) => {
    let image:S3Image;
    try {
        image = await uploadImageToS3(user_id, file, field) as S3Image;
    } catch(e) {
        throw new Error(e);
    }

    let results = await neode.instance.cypher(`
        MATCH (u:User {_id: '${user_id}'})
        SET u.${field} = '${image.data.Location}'
        RETURN u
    `, {})

    return filterFields(results.records[0].get('u').properties);
}

export const updateUserAvatar = async (req:Request, res:Response, next:NextFunction) => {
    let u = await neode.instance.find('User', req.params.uid);
    if(!u) throw new ErrorHandler(HTTP.NotFound, "No such user exists");

    try {
        let user = await updateImage(req.params.uid, req.file, 'avatar');
        res.json(user);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const updateUserCoverImage = async (req:Request, res:Response, next:NextFunction) => {
    let u = await neode.instance.find('User', req.params.uid);
    if(!u) throw new ErrorHandler(HTTP.NotFound, "No such user exists");

    try {
        let user = await updateImage(req.params.uid, req.file, 'cover_image');
        res.json(user);
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
}

export const deleteUser = async (req:Request, res:Response, next:NextFunction) => {
    let u = await neode.instance.find('User', req.params.uid);
    if(!u) throw new ErrorHandler(HTTP.NotFound, "No such user exists");
    try {
        await u.delete();
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    }
    return res.status(HTTP.OK).end();
}

export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    let email = req.body.email;
    let password = req.body.password;

    //find user by email
    let result = await neode.instance.cypher(`MATCH (u:User {email: $email}) RETURN u`, {email:email})
    if(!result.records.length) throw new ErrorHandler(HTTP.NotFound, [{param:'email', msg:'No such user for this email'}]);

    let user = result.records[0].get('u').properties as IUserModel;
    if(!user.verified) throw new ErrorHandler(HTTP.Unauthorised, [{param:'form', msg:'Your account has not been verified'}]);

    try {
        let match = bcrypt.compare(password, user.pw_hash);
        if(!match) throw new ErrorHandler(HTTP.Unauthorised, [{param:'password', msg:'Incorrect password'}]);

        req.session.user = {
            id: user._id,
            admin: user.admin || false
        }
        res.json(filterFields(user));
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError);
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
    await neode.instance.cypher(`
        MATCH (u1:User {_id:$_id1}), (u2:User {_id:$_id2})
        OPTIONAL MATCH (u1)-[r:FOLLOWS]-(u2)
        DELETE r
        MERGE (u1)-[:BLOCKS]->(u2)
    `, {
        _id1: req.params.uid,
        _id2: req.params.uid2
    })
    res.status(HTTP.OK).end();
}

export const unblockUser = async (req:Request, res:Response, next:NextFunction) => {
    await neode.instance.cypher(`
        MATCH (:User {_id:$_id1})-[r:BLOCKS]->(:User {_id:$_id2})
        DELETE r
    `, {
        _id1: req.params.uid,
        _id2: req.params.uid2
    })
    res.status(HTTP.OK).end();
}

export const followUser = async (req:Request, res:Response, next:NextFunction) => {
    let result = await neode.instance.cypher(`
        MATCH (u1:User { _id: $_id1 }), (u2:User { _id: $_id2 })
        OPTIONAL MATCH (u1)-[blocked:BLOCKS]-(u2)
        return u1, u2, blocked
    `, {
        _id1: req.params.uid,
        _id2: req.params.uid2
    })

    if(result.records[0].get('blocked') != null) {
        throw new ErrorHandler(HTTP.Unauthorised, "Can't follow blocked user");
    }

    await neode.instance.cypher(`
        MATCH (u1:User { _id: $_id1 }), (u2:User { _id: $_id2 })
        MERGE (u1)-[:FOLLOWS]->(u2)
    `, {
        _id1: req.params.uid,
        _id2: req.params.uid2,
    })

    res.status(HTTP.OK).end();
}

export const unfollowUser = async (req:Request, res:Response, next:NextFunction) => {
    await neode.instance.cypher(`
        MATCH (:User { _id: $_id1 })-[r:FOLLOWS]->(:User { _id: $_id2 })
        DELETE r
        `, {
            _id1: req.params.uid,
            _id2: req.params.uid2    
        })
    res.status(HTTP.OK).end();
}

export const readFollowers = async (req:Request, res:Response, next:NextFunction) => {

}

export const readBlockedUsers = async (req:Request, res:Response, next:NextFunction) => {
    
}
