import { Router, Request, Response }    from "express"
const { body } = require('express-validator');

import { validate } from '../common/validate';

import { 
    createPlant,
    updatePlant
} from '../controllers/Plants.controller';

import {
    createRecordable,
    readRecordable,
    deleteRecordable,
    updateRecordable,
    readAllRecordables
} from '../controllers/Recordable.controller';

import { RecordableTypes } from '../models/Recordable.model';

const router = Router({mergeParams: true});
router.use((req:Request, res:Response, next:any) => {
    res.locals.type = RecordableTypes.Plant
    next();
})

router.post('/', createRecordable, validate([
    body('species').not().isEmpty().trim(),
]), createPlant);

router.get('/', (req, res, next) => {
    res.locals["query"] = {"garden_id": undefined};
    next();
}, readAllRecordables);

router.get('/:rid', readRecordable);
router.put('/:rid', updateRecordable, updatePlant);

router.delete('/:rid', deleteRecordable);

export default router;