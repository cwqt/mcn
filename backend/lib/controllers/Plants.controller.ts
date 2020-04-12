import { Request, Response }    from "express"
import { Plant, IPlant }        from '../models/Plant.model'
import { Measurement }          from '../models/Measurement.model'
import { ACCEPTED_MEASUREMENTS }    from '../common/ACCEPTED_MEASUREMENTS';
const { validationResult }      = require('express-validator');

import { generateApiKey }      from '../controllers/ApiKeys.controller';

export const createPlant  = (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Plant.create(req.body, (error: any, response: any) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        generateApiKey(req.body.belongs_to, response.id, 'plant')
        res.json(response);
    });
}

export const readPlant = (req:Request, res:Response) => {
    Plant.findById(req.params.plant_id, (error:any, plant) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        return res.json(plant)
    })
}

export const updatePlant  = (req:Request, res:Response) => {
    const newData: any = {};

    if(req.body.name)       newData.name        = req.body.name;
    if(req.body.recording)  newData.recording   = req.body.recording;
    if(req.body.species)    newData.species     = req.body.species;
    if(req.body.image)      newData.image       = req.body.image;
    if(req.body.feed_url)   newData.feed_url    = req.body.feed_url;
    if(req.body.host_url)   newData.host_url    = req.body.host_url;
    if(req.body.parameters) newData.parameters  = req.body.parameters;
    if(req.body.in_garden)  newData.in_garden   = req.body.in_garden;

    Plant.findByIdAndUpdate(req.params.plant_id, newData, {new: true}, (error, plant) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        res.json(plant);
    });
}

export const deletePlant  = (req:Request, res:Response) => {
    Plant.findByIdAndDelete(req.params.plant_id, (error, response) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        return res.json(response)
    })
}

export const readMeasurements = (req:Request, res:Response) => {
    Measurement.find({}, (error:any, response:any) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        return res.json(response)
    })
}

export const createMeasurement = (req:Request, res:Response) => {
    Object.keys(req.body).forEach(type => {
        if(!Object.keys(ACCEPTED_MEASUREMENTS).includes(type)) {
            return res.status(400).json({'message':`${type} not an accepted measurement`})
        }
    })

    let newData = req.body
    newData.belongs_to = req.params.plant_id

    Measurement.create(newData, (error:any, response:any) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
        return res.json(response)
    })
}

export const readEvents = (req:Request, res:Response) => {}
export const createEvent = (req:Request, res:Response) => {}


export const pingPlantActive = (req:Request, res:Response) => {
    Plant.findByIdAndUpdate(req.params.plant_id, {"last_ping": new Date()}, {new: true}, (error, plant) => {
        if (error) {res.status(400).end(); return }
        res.status(200).end();
    });
}