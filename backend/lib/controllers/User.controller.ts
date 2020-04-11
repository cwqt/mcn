import bcrypt                                   from "bcrypt"
import { Request, Response, NextFunction }      from "express"

import { User, IUserModel }             from "../models/User.model"
import { sendVerificationEmail }        from "./Email.controller";
import { ErrorHandler }                 from '../common/errorHandler';
import { HTTP }                         from '../common/http';
import config                           from '../config';
import { uploadImageToS3, S3Image }     from '../common/storage';


export const readAllUsers = (req:Request, res:Response, next:NextFunction) => {
    User.find({}, (error:any, response:any) => {
        if (error) return next(new ErrorHandler(HTTP.ServerError, error))
        return res.json(response)
    })
}

export const createUser = (req:Request, res:Response, next:NextFunction) => {
    //generate password hash
    req.body["salt"] = bcrypt.genSaltSync(10)
    req.body["pw_hash"] = bcrypt.hashSync(req.body["password"], req.body["salt"])
    delete req.body["password"]

    //Username musn't be taken, nor the email
    User.find({$or: [{email: req.body.email}, {username: req.body.username}]}, (error:any, user:IUserModel[]) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error['message']));
        if(user.length > 0) {
            let errors = []
            if(user[0].username == req.body.username) errors.push({param:"username", msg:"username is taken"})
            if(user[0].email == req.body.email) errors.push({param:"email", msg:"email already in use"})
            return next(new ErrorHandler(HTTP.Conflict, errors))
        } else {
            req.body["verified"] = false;
            req.body["new_user"] = true;

            let emailSent = sendVerificationEmail(req.body.email)
            emailSent.then(success => {
                if(!success) return next(new ErrorHandler(HTTP.ServerError, 'Verification email could not be sent'))
                User.create(req.body, (error: any, response: any) => {
                    if (error) return next(new ErrorHandler(HTTP.ServerError, error.message));
                    res.status(HTTP.Created).json(response);
                });            
            })
        }
    }).catch(next)
}

export const readUser = (req:Request, res:Response, next:NextFunction) => {
    User.findById(req.params.uid, (error:any, response:any) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error.message));
        if(!response) return next(new ErrorHandler(HTTP.NotFound, "No such user exists"))
        return res.json(response)
    })
}

export const updateUser = (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    if(req.body.name)         { newData.name = req.body.name }
    if(req.body.avatar)       { newData.avatar = req.body.avatar }
    if(req.body.email)        { newData.email = req.body.email }
    if(req.body.location)     { newData.location = req.body.location }
    if(req.body.cover_image)  { newData.cover_image = req.body.cover_image }
    if(req.body.bio)          { newData.bio = req.body.bio }

    let promises:Promise<any>[] = [];
    req.files = req.files as { [fieldname: string]: Express.Multer.File[]; };

    if(req.files['avatar'][0]) promises.push(uploadImageToS3(req.params.uid, req.files['avatar'][0], 'avatar')); 
    if(req.files['cover_image'][0]) promises.push(uploadImageToS3(req.params.uid, req.files['cover_image'][0], 'cover_image')); 

    Promise.all(promises).then((uploadedImages:S3Image[]) => {
        uploadedImages.forEach((image:S3Image) => {
            newData[image.fieldname] = image.data.Location;
        })

        User.findByIdAndUpdate(req.params.uid, newData, {new:true}, (error:any, response:any) => {
            if (error) return next(new ErrorHandler(HTTP.ServerError, error))
            return res.json(response)
        })    
    })
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
    User.findOne({email: email}, (err, user) => {
        if(err) return next(new ErrorHandler(HTTP.ServerError))
        if(!user) return next(new ErrorHandler(HTTP.NotFound, [{param:'email', msg:'No such user for this email'}]))
        if(!user.verified) return next(new ErrorHandler(HTTP.Unauthorised, [{param:'form', msg:'Your account has not been verified'}]))

        bcrypt.compare(password, user.pw_hash, (err, result) => {
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