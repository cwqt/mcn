import bcrypt                   from "bcrypt"
import { Request, Response }    from "express"
import { User }                 from "../models/User.model"
import { ErrorHandler } from '../common/errorHandler';

export const readAllUsers = (req:Request, res:Response) => {
    User.find({}, (error:any, response:any) => {
        if (error) { res.status(400).json({message: error}); return }
        return res.json(response)
    })
}

export const createUser = (req:Request, res:Response) => {
    //generate password hash
    req.body["salt"] = bcrypt.genSaltSync(10)
    req.body["pw_hash"] = bcrypt.hashSync(req.body["password"], req.body["salt"])
    delete req.body["password"]

    //Username musn't be taken, nor 
    User.find({$or: [{email: req.body.email}, {username: req.body.username}]}, (error:any, response:any) => {
        if(error) throw new ErrorHandler(400, error['message']);
        if(response.length > 0) {
            let errors = []
            if(response[0].username == req.body.username) errors.push({param:"username", msg:"username is taken"})
            if(response[0].email == req.body.email) errors.push({param:"email", msg:"email already in use"})
            throw new ErrorHandler(400, errors)
        } else {
            req.body["verified"] = false;
    
            User.create(req.body, (error: any, response: any) => {
                if (error)  throw new ErrorHandler(400, error.message);
                res.json(response);
            });        
        }
    })
}

export const readUser = (req:Request, res:Response) => {
    User.findById(req.params.id).select('-salt -pw_hash').exec((error:any, response:any) => {
        if (error) throw new ErrorHandler(422, error.message);
        return res.json(response)
    })
}

export const updateUser = (req:Request, res:Response) => {
    var newData:any = {}
    if(req.body.name)   { newData.name = req.body.name }
    if(req.body.avatar) { newData.avatar = req.body.avatar }
    if(req.body.email)  { newData.email = req.body.email }

    User.findByIdAndUpdate({_id: req.params.id}, newData, (error:any, response:any) => {
        if (error) throw new ErrorHandler(400, error)
        return res.json(response)
    })
}

export const deleteUser = (req:Request, res:Response) => {
    User.findOneAndDelete({ _id: req.params.id }, (error:any) => {
        if (error) throw new ErrorHandler(400, error)
        return res.status(200).end()
    })
}
