import { Router, Request, Response, NextFunction }    from "express"
const { body } = require('express-validator');
const AsyncRouter               = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';

import { 
    createPlant,
    updatePlant
} from '../controllers/Plants.controller';

import {
    createRecordable,
    // readRecordable,
    // deleteRecordable,
    // updateRecordable,
    readAllRecordables
} from '../controllers/Recordable.controller';

import { RecordableTypes } from '../models/Recordable.model';

const router = AsyncRouter({mergeParams: true});
router.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.type = RecordableTypes.Plant
    next();
})

router.post('/', createRecordable, validate([
    body('species').not().isEmpty().trim(),
]), createPlant);

router.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.locals["query"] = {"garden_id": undefined};
    next();
}, readAllRecordables);

// router.get('/:rid', readRecordable);
// router.put('/:rid', updateRecordable, updatePlant);

// router.delete('/:rid', deleteRecordable);

export default router;