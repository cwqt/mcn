import bcrypt                   from "bcrypt"
import { Request, Response, NextFunction }    from "express"
import { User }                 from "../models/User.model"
import { sendVerificationEmail } from "./Email.controller";
import { ErrorHandler } from '../common/errorHandler';

export const readAllUsers = (req:Request, res:Response, next:NextFunction) => {
    User.find({}, (error:any, response:any) => {
        if (error) next(new ErrorHandler(400, error))
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
        if(error) next(new ErrorHandler(400, error['message']));
        if(response.length > 0) {
            let errors = []
            if(response[0].username == req.body.username) errors.push({param:"username", msg:"username is taken"})
            if(response[0].email == req.body.email) errors.push({param:"email", msg:"email already in use"})
            next(new ErrorHandler(400, errors))
        } else {
            req.body["verified"] = false;

            let emailSent = sendVerificationEmail(req.body.email)
            emailSent.then(success => {
                if(!success) next(new ErrorHandler(400, 'Verification email could not be sent'))
                User.create(req.body, (error: any, response: any) => {
                    if (error) next(new ErrorHandler(400, error.message));
                    res.json(response);
                });            
            })
        }
    }).catch(next)
}

export const readUser = (req:Request, res:Response, next:NextFunction) => {
    User.findById(req.params.id).select('-salt -pw_hash').exec((error:any, response:any) => {
        if (error) next(new ErrorHandler(422, error.message));
        return res.json(response)
    })
}

export const updateUser = (req:Request, res:Response, next:NextFunction) => {
    var newData:any = {}
    if(req.body.name)   { newData.name = req.body.name }
    if(req.body.avatar) { newData.avatar = req.body.avatar }
    if(req.body.email)  { newData.email = req.body.email }

    User.findByIdAndUpdate({_id: req.params.id}, newData, (error:any, response:any) => {
        if (error) next(new ErrorHandler(400, error))
        return res.json(response)
    })
}

export const deleteUser = (req:Request, res:Response, next:NextFunction) => {
    User.findOneAndDelete({ _id: req.params.id }, (error:any) => {
        if (error) next(new ErrorHandler(400, error))
        return res.status(200).end()
    })
}
