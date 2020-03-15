import { Request, Response }    from "express"
import { Plant, IPlant }        from '../models/Plant.model'
const { validationResult }      = require('express-validator');

export const createPlant  = (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Plant.create(req.body, (error: any, response: any) => {
        if (error) { res.status(400).json({message: error["message"]}); return }
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
