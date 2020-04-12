import { Request, Response, NextFunction }    from "express"

import { Plant, IPlantModel }       from '../models/Plant.model'
import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

export const createPlant = (req:Request, res:Response, next:NextFunction) => {
    Plant.create(req.body, (error:any, plant:IPlantModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(plant);
    })
}

export const updatePlant = (req:Request, res:Response, next:NextFunction) => {
    Plant.findByIdAndUpdate(req.params.rid, res.locals.newData, {new:true}, (error:any, plant:IPlantModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(plant);
    })
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
