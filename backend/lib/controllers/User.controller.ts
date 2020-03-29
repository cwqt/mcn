import bcrypt                   from "bcrypt"
import { Request, Response, NextFunction }    from "express"
import { User }                 from "../models/User.model"
import { sendVerificationEmail } from "./Email.controller";
import { ErrorHandler } from '../common/errorHandler';

export const readAllUsers = (req:Request, res:Response, next:NextFunction) => {
    User.find({}, (error:any, response:any) => {
        if (error) return next(new ErrorHandler(400, error))
        return res.json(response)
    })
}

export const createUser = (req:Request, res:Response, next:NextFunction) => {
    //generate password hash
    req.body["salt"] = bcrypt.genSaltSync(10)
    req.body["pw_hash"] = bcrypt.hashSync(req.body["password"], req.body["salt"])
    delete req.body["password"]

    //Username musn't be taken, nor the email
    User.find({$or: [{email: req.body.email}, {username: req.body.username}]}, (error:any, response:any) => {
        if(error) return next(new ErrorHandler(400, error['message']));
        if(response.length > 0) {
            let errors = []
            if(response[0].username == req.body.username) errors.push({param:"username", msg:"username is taken"})
            if(response[0].email == req.body.email) errors.push({param:"email", msg:"email already in use"})
            return next(new ErrorHandler(400, errors))
        } else {
            req.body["verified"] = false;

            let emailSent = sendVerificationEmail(req.body.email)
            emailSent.then(success => {
                if(!success) return next(new ErrorHandler(400, 'Verification email could not be sent'))
                User.create(req.body, (error: any, response: any) => {
                    if (error) return next(new ErrorHandler(400, error.message));
                    res.json(response);
                });            
            })
        }
    }).catch(next)
}

export const readUser = (req:Request, res:Response, next:NextFunction) => {
    User.findById(req.params.id, (error:any, response:any) => {
        if(error) return next(new ErrorHandler(422, error.message));
        if(!response) return next(new ErrorHandler(404, "No such user exists"))
        return res.json(response)
    })
}

export const updateUser = (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    if(req.body.name)   { newData.name = req.body.name }
    if(req.body.avatar) { newData.avatar = req.body.avatar }
    if(req.body.email)  { newData.email = req.body.email }

    User.findByIdAndUpdate({_id: req.params.id}, newData, (error:any, response:any) => {
        if (error) return next(new ErrorHandler(400, error))
        return res.json(response)
    })
}

export const deleteUser = (req:Request, res:Response, next:NextFunction) => {
    User.findOneAndDelete({ _id: req.params.id }, (error:any) => {
        if (error) return next(new ErrorHandler(400, error))
        return res.status(200).end()
    })
}

export const loginUser = (req:Request, res:Response, next:NextFunction) => {
    let email = req.body.email;
    let password = req.body.password;
  
    //see if user exists
    User.findOne({email: email}, (err, user) => {
        if(err) return next(new ErrorHandler(500))
        if(!user) return next(new ErrorHandler(404, [{param:'email', msg:'No such user for this email'}]))
        if(!user.verified) return next(new ErrorHandler(403, [{param:'form', msg:'Your account has not been verified'}]))

        bcrypt.compare(password, user.pw_hash, (err, result) => {
            if(err) return next(new ErrorHandler(500))
            if(!result) return next(new ErrorHandler(401, [{param:'password', msg:'Incorrect password'}]))
            
            // All checks passed, create session
            req.session.user = {
                id: user.id,
                admin: user.admin || false
            }
            res.status(200).json(user)
        })
    })
}

export const logoutUser = (req:Request, res:Response, next:NextFunction) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) return next(new ErrorHandler(400, 'Logging out failed'))
            res.status(200).end()
        })
    }
}