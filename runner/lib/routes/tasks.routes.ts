import { validate } from '../common/validate'; 
import { markTaskComplete } from '../controllers/tasks.controller';
import { TaskResolutionStates } from '../models/Tasks.model';
import { Request, Response, NextFunction } from 'express';
const AsyncRouter               = require("express-async-router").AsyncRouter;
const { body, param, query }    = require('express-validator');

const router = AsyncRouter({mergeParams: true});

router.post(`/:jid/${TaskResolutionStates.Success}`,
    (req:Request, res:Response, next:NextFunction) => {
        res.locals.state = TaskResolutionStates.Success
}, markTaskComplete);

router.post(`/:jid/${TaskResolutionStates.Fail}`,
    (req:Request, res:Response, next:NextFunction) => {
        res.locals.state = TaskResolutionStates.Fail
}, validate([
    body('message').not().isEmpty().withMessage('Failed task requires a reason')
]), markTaskComplete);

export default router;