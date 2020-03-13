import bcrypt                   from "bcrypt"
import { Request, Response }    from "express"
import { Recordable, RecordableTypes } from "../models/Recordable.model"
const { validationResult }      = require('express-validator');

// Event based system notifies when an action needs completing e.g. watering, re-seeding
// Gardens and Plants, manage entire gardens constituted of subplants
// Remotely trigger events on micro-controllers, e.g. turn on light, open watering valve
// Monitor all metrics on front-end dashboard with graphs
// Live camera feed (No IR) to view active photosynthesis
// Code support for ESP-32, Wemos D1 Mini & Raspberry Pi

export const readAllRecordables = (req:Request, res:Response, type:string) => {
    // User.find({}, (error:any, response:any) => {
    //     if (error) { res.status(400).json({message: error}); return }
    //     return res.json(response)
    // })
}

// export const createUser = (req:Request, res:Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }

//     //generate password hash
//     req.body["salt"] = bcrypt.genSaltSync(10)
//     req.body["pw_hash"] = bcrypt.hashSync(req.body["password"], req.body["salt"])
//     delete req.body["password"]

//     User.create(req.body, (error: any, response: any) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         res.json(response);
//     });
// }

// export const readUser = (req:Request, res:Response) => {
//     User.find({_id: req.params.id}, (error:any, response:any) => {
//         if (error) { res.status(400).json({message: error}); return }
//         return res.json(response)
//     })
// }

// export const updateUser = (req:Request, res:Response) => {
//     var newData:any = {}
//     if(req.body.name)   { newData.name = req.body.name }
//     if(req.body.avatar) { newData.avatar = req.body.avatar }
//     if(req.body.email)  { newData.email = req.body.email }

//     User.findByIdAndUpdate({_id: req.params.id}, newData, (error:any, response:any) => {
//         if (error) { res.status(400).json({message: error}); return }
//         return res.json(response)
//     })
// }

// export const deleteUser = (req:Request, res:Response) => {
//     User.findOneAndDelete({ _id: req.params.id }, (error:any) => {
//         if (error) { res.status(400).json({message: error}); return }
//         return res.status(200).end()
//     })
// }



// /// measurements
// ///