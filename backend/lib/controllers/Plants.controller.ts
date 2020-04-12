import { Request, Response, NextFunction }    from "express"

import { Plant, IPlantModel }       from '../models/Plant.model'
import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

export const createPlant = (req:Request, res:Response, next:NextFunction) => {
    Plant.create(req.body, (error:any, plant:IPlantModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError));
        res.json(plant);
    })
}



// export const readPlant = (req:Request, res:Response) => {
//     Plant.findById(req.params.plant_id, (error:any, plant) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         return res.json(plant)
//     })
// }

// export const updatePlant  = (req:Request, res:Response) => {
//     const newData: any = {};

//     if(req.body.name)       newData.name        = req.body.name;
//     if(req.body.recording)  newData.recording   = req.body.recording;
//     if(req.body.species)    newData.species     = req.body.species;
//     if(req.body.image)      newData.image       = req.body.image;
//     if(req.body.feed_url)   newData.feed_url    = req.body.feed_url;
//     if(req.body.parameters) newData.parameters  = req.body.parameters;
//     if(req.body.garden_id)  newData.garden_id   = req.body.garden_id;

//     Plant.findByIdAndUpdate(req.params.plant_id, newData, {new: true}, (error, plant) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         res.json(plant);
//     });
// }

// export const deletePlant  = (req:Request, res:Response) => {
//     Plant.findByIdAndDelete(req.params.plant_id, (error, response) => {
//         if (error) { res.status(400).json({message: error["message"]}); return }
//         return res.json(response)
//     })
// }

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
