import { Request, Response } from 'express';

import { Plant } from "../models/Plant.model";
import { Garden } from "../models/Garden.model";
import { ApiKey } from "../models/ApiKey.model"

export const generateRecordableSymmetricKey = (req:Request, res:Response) => {}

export const validateMessageWithKey = (req:Request, res:Response) => {
    const recordable_id = req.header('_id');
    const type          = req.header('type');
    if(!recordable_id || !type) {
        res.status(400).json({message:'Needs headers'});
    }
    if(!['plant', 'garden'].includes(type)) {
        res.status(400).json({message:'Must be correct type'});
    }

    let model;
    if(type == 'plant') model = Plant
    if(type == 'garden') model = Garden


}