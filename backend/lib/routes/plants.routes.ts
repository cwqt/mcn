import { Router }               from 'express';
import { Request, Response }    from "express"
const { body } = require('express-validator');

import { 
    readPlant,
    createPlant,
    updatePlant,
    deletePlant,
} from '../controllers/Plants.controller';

const plants = Router();
plants.use((req:Request, res:Response, next:any) => {
    res.locals.type = 'plant'
    next();
})

plants.get('/:plant_id',       readPlant)

plants.post('/', [
    body('name').not().isEmpty().trim(),
    body('belongs_to').not().isEmpty().trim(),
    body('species').not().isEmpty().trim(),
], createPlant)

plants.put('/:plant_id',        updatePlant)
plants.delete('/:plant_id',     deletePlant)

export default plants;