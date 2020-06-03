import { Router, NextFunction }               from 'express';
import { Request, Response }    from "express"
const { body } = require('express-validator');

import { validate } from '../common/validate';

import { 
    createGarden,
    updateGarden,
} from '../controllers/Recordables/Gardens.controller';

// import {
//     createRecordable,
//     readRecordable,
//     deleteRecordable,
//     updateRecordable,
//     readAllRecordables
// } from '../controllers/Recordable.controller';

import { RecordableType } from '../models/Recordable.model';

const router = Router({mergeParams: true});
// router.use((req:Request, res:Response, next:NextFunction) => {
//     res.locals.type = RecordableTypes.Garden
//     next();
// })

// router.post('/', createRecordable, validate([]), createGarden);

// router.get('/', readAllRecordables);

// router.get('/:rid/plants', (req, res, next) => {
//     res.locals["query"] = {"garden_id": req.params.rid};
//     res.locals.type = RecordableTypes.Plant;
//     next();
// }, readAllRecordables);

// router.get('/:rid', readRecordable);
// router.put('/:rid', updateRecordable, updateGarden);

// router.delete('/:rid', deleteRecordable);


export default router;