import { Router }               from 'express';
import { Request, Response }    from "express"
const { body } = require('express-validator');

import { 
    readPlant,
    createPlant,
    updatePlant,
    deletePlant,
    readMeasurements,
    createMeasurement,
    readEvents,
    createEvent,
    pingPlantActive
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

plants.get('/:plant_id/measurements',   readMeasurements)
plants.post('/:plant_id/measurements',  createMeasurement)

plants.get('/:plant_id/measurements',   readEvents)
plants.post('/:plant_id/events',        createEvent)



plants.get('/:plant_id/ping',  pingPlantActive)


export default plants;