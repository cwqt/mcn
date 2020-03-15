import { Router }               from 'express';
import { Request, Response }    from "express"
const { body } = require('express-validator');

import { 
    readGarden,
    createGarden,
    updateGarden,
    deleteGarden,
} from '../controllers/Gardens.controller';

const gardens = Router();
gardens.use((req:Request, res:Response, next:any) => {
    res.locals.type = 'garden'
    next();
})

gardens.get('/:garden_id',       readGarden)

gardens.post('/', [
    body('name').not().isEmpty().trim(),
    body('belongs_to').not().isEmpty().trim(),
], createGarden)

gardens.put('/:garden_id',        updateGarden)
gardens.delete('/:garden_id',     deleteGarden)

export default gardens;