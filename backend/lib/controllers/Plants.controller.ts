import { Request, Response, NextFunction }    from "express"

import { IPlant }       from '../models/Plant.model'
import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

import { n4j } from '../common/neo4j';

export const createPlant = async (req:Request, res:Response, next:NextFunction) => {
    // let result = await neode.instance.cypher(`
    //     MATCH (u:User {_id:$uid})
    //     CREATE (p:Plant $body)<-[:CREATED]-(u)
    //     return p
    // `, {
    //     uid: req.params.uid,
    //     body: req.body
    // })

    // if(!result.records.length) throw new ErrorHandler(HTTP.ServerError);
    // res.status(HTTP.Created).json(result.records[0].get('p').properties);
}

export const updatePlant = (req:Request, res:Response, next:NextFunction) => {
}


// export const readMeasurements = (req:Request, res:Response) => {
//     Measurement.find({}, (error:any, response:any) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         return res.json(response)
//     })
// }

// export const createMeasurement = (req:Request, res:Response) => {
//     Object.keys(req.body).forEach(type => {
//         if(!Object.keys(ACCEPTED_MEASUREMENTS).includes(type)) {
//             return res.status(400).json({'message':`${type} not an accepted measurement`})
//         }
//     })

//     let newData = req.body
//     newData.belongs_to = req.params.plant_id

//     Measurement.create(newData, (error:any, response:any) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         return res.json(response)
//     })
// }

// export const readEvents = (req:Request, res:Response) => {}
// export const createEvent = (req:Request, res:Response) => {}
