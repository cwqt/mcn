import bcrypt                                   from "bcrypt"
import { Request, Response, NextFunction }      from "express"

import { User, IUserModel }             from "../models/User.model"
import { sendVerificationEmail }        from "./Email.controller";
import { ErrorHandler }                 from '../common/errorHandler';
import { HTTP }                         from '../common/http';
import config                           from '../config';
import { uploadImageToS3, S3Image }     from '../common/storage';

export const readAllUsers = (req:Request, res:Response, next:NextFunction) => {
    User.find({}, (error:any, users:IUserModel[]) => {
        if (error) return next(new ErrorHandler(HTTP.ServerError, error))
        return res.json(users)
    })
}

export const createUser = (req:Request, res:Response, next:NextFunction) => {
    //generate password hash
    req.body["salt"] = bcrypt.genSaltSync(10)
    req.body["pw_hash"] = bcrypt.hashSync(req.body["password"], req.body["salt"])
    delete req.body["password"]

    //Username musn't be taken, nor the email
    User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, (error:any, user:IUserModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error['message']));
        if(user) {
            let errors = []
            if(user.username == req.body.username) errors.push({param:"username", msg:"username is taken"})
            if(user.email == req.body.email) errors.push({param:"email", msg:"email already in use"})
            return next(new ErrorHandler(HTTP.Conflict, errors))
        } else {
            let emailSent = sendVerificationEmail(req.body.email)
            emailSent.then(success => {
                if(!success) return next(new ErrorHandler(HTTP.ServerError, 'Verification email could not be sent'))
                User.create(req.body, (error: any, created_user:IUserModel) => {
                    if (error) return next(new ErrorHandler(HTTP.ServerError, error.message));
                    res.status(HTTP.Created).json(created_user);
                });            
            })
        }
    }).catch(next)
}

export const readUser = (req:Request, res:Response, next:NextFunction) => {
    User.findById(req.params.uid, (error:any, user:IUserModel | undefined) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error.message));
        if(!user) return next(new ErrorHandler(HTTP.NotFound, "No such user exists"))
        return res.json(user)
    })
}

export const updateUser = (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    let allowedFields = ["name", "email", "location", "bio", "new_user"];
    let reqKeys = Object.keys(req.body);
    for(let i=0; i<reqKeys.length; i++) {
        if(!allowedFields.includes(reqKeys[i])) continue;
        newData[reqKeys[i]] = req.body[reqKeys[i]];
    }

    User.findByIdAndUpdate(req.params.uid, newData, {new:true, runValidators:true}, (error:any, user:IUserModel) => {
        if (error) return next(new ErrorHandler(HTTP.ServerError, error))
        return res.json(user)
    })    
}

const updateImage = (user_id:string, file:Express.Multer.File, field:string) => {
    return new Promise((resolve, reject) => {
        uploadImageToS3(user_id, file, field).then((image:S3Image) => {
            User.findByIdAndUpdate(user_id, {[field]: image.data.Location}, {new:true}, (error:any, user:IUserModel) => {
                if (error) reject(error)
                return resolve(user)
            })                
        }).catch(err => reject(err))
    })
}

export const updateUserAvatar = (req:Request, res:Response, next:NextFunction) => {
    updateImage(req.params.uid, req.file, 'avatar').then((user:IUserModel) => {
        res.json(user)
    }).catch(err => next(new ErrorHandler(HTTP.ServerError, err)))
}

export const updateUserCoverImage = (req:Request, res:Response, next:NextFunction) => {
    updateImage(req.params.uid, req.file, 'cover_image').then((user:IUserModel) => {
        res.json(user)
    }).catch(err => next(new ErrorHandler(HTTP.ServerError, err)))
}

export const deleteUser = (req:Request, res:Response, next:NextFunction) => {
    User.findOneAndDelete({ _id: req.params.uid }, (error:any) => {
        if (error) return next(new ErrorHandler(HTTP.ServerError, error))
        return res.status(HTTP.OK).end()
    })
}

export const loginUser = (req:Request, res:Response, next:NextFunction) => {
    let email = req.body.email;
    let password = req.body.password;
  
    //see if user exists
    User.findOne({email: email}, (err, user:IUserModel | undefined) => {
        if(err) return next(new ErrorHandler(HTTP.ServerError))
        if(!user) return next(new ErrorHandler(HTTP.NotFound, [{param:'email', msg:'No such user for this email'}]))
        if(!user.verified) return next(new ErrorHandler(HTTP.Unauthorised, [{param:'form', msg:'Your account has not been verified'}]))

        bcrypt.compare(password, user.pw_hash, (err, result:boolean) => {
            if(err) return next(new ErrorHandler(HTTP.ServerError))
            if(!result) return next(new ErrorHandler(HTTP.Unauthorised, [{param:'password', msg:'Incorrect password'}]))
            
            // All checks passed, create session
            req.session.user = {
                id: user._id,
                admin: user.admin || false
            }
            res.json(user)
        })
    })
}

export const logoutUser = (req:Request, res:Response, next:NextFunction) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) return next(new ErrorHandler(HTTP.ServerError, 'Logging out failed'))
            res.status(HTTP.OK).end()
        })
    }
}