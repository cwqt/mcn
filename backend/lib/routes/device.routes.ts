import { Router, NextFunction, Request, Response } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 
var AsyncRouter = require("express-async-router").AsyncRouter;

import { readAllMeasurements } from '../controllers/Measurements.controller';
import {
    createDevice,
    assignDeviceToRecordable,
    readDevice,
    pingDevice,
    // updateDevice,
    // deleteDevice,
} from "../controllers/Device.controller";

import {
    createApiKey,
    readApiKey,
    deleteApiKey
} from '../controllers/ApiKeys.controller';
import { RecordableType } from '../models/Recordable.model';
import { heartRecordable, repostRecordable, unheartRecordable, readAllRecordables } from '../controllers/Recordable.controller';

const router = AsyncRouter({mergeParams: true});
router.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.type = RecordableType.Device
    next();
})

router.get('/', readAllRecordables);
router.post('/', validate([
    body('name').not().isEmpty().trim().withMessage('device must have friendly name'),
]), createDevice);

// DEVICES ========================================================================================
const deviceRouter = AsyncRouter({mergeParams: true});
router.use('/:did', deviceRouter);

deviceRouter.use(validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
]));

deviceRouter.get('/',               readDevice);
deviceRouter.get('/measurements',   readAllMeasurements);
deviceRouter.get('/ping',           pingDevice);
deviceRouter.post('/repost',        repostRecordable);
deviceRouter.post('/heart',         heartRecordable);
deviceRouter.delete('/heart',       unheartRecordable);

deviceRouter.post('/assign/:rid', validate([
    param('rid').isMongoId().trim().withMessage('invalid recordable id to assign to')
]), assignDeviceToRecordable);

// router.post('/:pid/reply', validate([
//     body('content').not().isEmpty().trim().withMessage('reply must have some content'),
// ]), replyToRecordable);

// router.put('/:did', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id')
// ]), updateDevice);

// router.delete('/:did', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id')
// ]), deleteDevice);

deviceRouter.post('/keys', validate([
    body('recordable_type')
        .not().isEmpty().trim()
        .isIn(Object.values(RecordableType)).withMessage(`must be of type: ${Object.values(RecordableType)}`),
    body('key_name').not().isEmpty().trim().withMessage('device name must be named'),
]), createApiKey)

// API KEYS =======================================================================================
const keyRouter = AsyncRouter({mergeParams:true});
deviceRouter.use('/keys/:kid', keyRouter);

keyRouter.use(validate([
    param('kid').isMongoId().trim().withMessage('invalid key id'),
]));

keyRouter.get('/',      readApiKey)
keyRouter.delete('/',   deleteApiKey)

export default router;