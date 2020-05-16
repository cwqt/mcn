import {Request, Response, NextFunction }    from "express"
const { body, param } = require('express-validator');
const AsyncRouter     = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';

import { 
    createPlant,
    updatePlant
} from '../controllers/Plants.controller';

import {
    createRecordable,
    // readRecordable,
    // deleteRecordable,
    updateRecordable,
    readAllRecordables,
    readRecordable,
    unheartRecordable,
    heartRecordable,
    repostRecordable
} from '../controllers/Recordable.controller';

import { RecordableType } from '../models/Recordable.model';
import {
    readAllMeasurements,
    deleteMeasurements
} from "../controllers/Measurements.controller";

const router = AsyncRouter({mergeParams: true});
router.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.type = RecordableType.Plant
    next();
})

router.post('/', createRecordable, validate([
    body('species').not().isEmpty().trim(),
]), createPlant);

router.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.locals["query"] = {"garden_id": undefined};
    next();
}, readAllRecordables);

// PLANT ==========================================================================================
const plantRouter = AsyncRouter({mergeParams: true});
router.use('/:rid', plantRouter);

plantRouter.use(validate([
    param('pid').isMongoId().trim().withMessage('invalid plant id')
]))

router.get('/',         readRecordable)
router.put('/',         updateRecordable, updatePlant);
// router.delete('/',      deleteRecordable);

router.post('/repost',  repostRecordable);
router.post('/heart',   heartRecordable);
router.delete('/heart', unheartRecordable);

router.get('/measurements', readAllMeasurements);
router.delete('/measurements', deleteMeasurements);

export default router;