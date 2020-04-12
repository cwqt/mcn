import { Router }               from 'express';
import { Request, Response }    from "express"
const { body } = require('express-validator');

import { 
    createPlant,
} from '../controllers/Plants.controller';

import {
    createRecordable,
} from '../controllers/Recordable.controller';

import { RecordableTypes } from '../models/Recordable.model';
import { create } from 'domain';

const router = Router({mergeParams: true});
router.use((req:Request, res:Response, next:any) => {
    res.locals.type = RecordableTypes.Plant
    next();
})

// router.get('/:rid',       readRecordable)
router.post('/',              createRecordable, createPlant);

// router.post('/', [
//     body('name').not().isEmpty().trim(),
//     body('belongs_to').not().isEmpty().trim(),
//     body('species').not().isEmpty().trim(),
// ], createPlant)

// router.put('/:plant_id',        updatePlant)
// router.delete('/:plant_id',     deletePlant)

// router.get('/:plant_id/measurements',   readMeasurements)
// router.post('/:plant_id/measurements',  createMeasurement)

// router.get('/:plant_id/measurements',   readEvents)
// router.post('/:plant_id/events',        createEvent)

export default router;