import { validate } from '../common/validate';
const { body, param } = require('express-validator');
const AsyncRouter = require("express-async-router").AsyncRouter;

import { Request, Response, NextFunction } from 'express';

import { Measurement as AcceptedMeasurement } from '../common/types/measurements.types';
import {
    createMeasurement,
    deleteMeasurement,
    readMeasurements,
    getMeasurementTypes
} from '../controllers/Measurements.controller';
import { RecorderTypes } from '../models/Measurement.model';
import { RecordableTypes } from '../models/Recordable.model';
import { ErrorHandler } from '../common/errorHandler';
import { HTTP } from '../common/http';

const router = AsyncRouter({mergeParams: true});

const validateMeasurementTypes = () => {
    body('measurements')
    .custom((m:any) => typeof m === 'object')
    .custom((o:any) => {
        o = Object.keys(o);
        //x should have same no. as measurements as o, if they're all valid
        let x = o.some((r:any) => Object.values(AcceptedMeasurement).includes(r))
        if(x.length != o.length) return false;
        return true;
    })
}

//users have no link to a recordable & require an explict link in the route param
router.post('/users/:uid/:rtype/:rid', validate([
    param('uid').isMongoId().trim().withMessage('invalid user'),
    param('rid').isMongoId().trim().withMessage('invalid recordable id'),
    validateMeasurementTypes
]), ((req:Request, res:Response, next:NextFunction) => {
    res.locals["type"] = RecorderTypes.User
    switch(req.params.rtype) {
        case RecordableTypes.Plant:
            res.locals["recordable_type"] = RecordableTypes.Plant
            break;
        case RecordableTypes.Garden:
            res.locals["recordable_type"] = RecordableTypes.Garden
            break;
        default:
            throw new ErrorHandler(HTTP.BadRequest, `Invalid recordable type: ${req.params.rtype}`);
    }
    next();
}), createMeasurement)


//devices are assigned to a specific device, whereas users are not
// & can create measurements on any recordable
router.post('/devices/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid user'),
    validateMeasurementTypes
]), ((req:Request, res:Response, next:NextFunction) => {
    res.locals["type"] = RecorderTypes.Device;
    next();
}), createMeasurement)


router.get('/types', getMeasurementTypes);

//seconds since unix epoch
router.get('/time', (req:Request, res:Response) => {
    const now = new Date()
    return res.json({data: Math.round(now.getTime() / 1000)})
})

export default router;