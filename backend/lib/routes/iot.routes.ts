import { validate } from '../common/validate';
const { body, param } = require('express-validator');
const AsyncRouter = require("express-async-router").AsyncRouter;

import { Request, Response, NextFunction } from 'express';

import { Measurement as AcceptedMeasurement, IoTMeasurement } from '../common/types/measurements.types';
import { authenticateApiKey } from '../controllers/Auth.controller';
import {
    createMeasurementAsDevice,
    createMeasurementAsUser,
    getMeasurementTypes,
} from '../controllers/Device/Measurements.controller';
import { RecorderType } from '../models/Measurement.model';
import { RecordableType } from '../models/Recordable.model';
import { ErrorHandler } from '../common/errorHandler';
import { HTTP } from '../common/http';

const router = AsyncRouter({mergeParams: true});

const validateRecordableMeasurementTypes = () => {
    return body()
    .custom((m:any) => typeof m === 'object')
    .custom((o:any) => {
        //filter will remove all valid keys, leaving bad ones behind
        let invalidMeasurements = Object.keys(o.recordable_data).filter((r:any) => {
            return !Object.values(AcceptedMeasurement).includes(r);
        });
        if(invalidMeasurements.length > 0) return Promise.reject(`Invalid measurement types: ${invalidMeasurements}`);
        return true;
    })
}

const validateDeviceMeasurementTypes = () => {
    return body()
    .custom((m:any) => typeof m === 'object')
    .custom((o:any) => {
        if(!o.device_data) return true;//devices don't need to send data
        let invalidMeasurements = Object.keys(o.device_data).filter((r:any) => {
            return !Object.values(IoTMeasurement).includes(r);
        });
        if(invalidMeasurements.length > 0) return Promise.reject(`Invalid measurement types: ${invalidMeasurements}`);
        return true;
    })
}

//users have no link to a recordable & require an explict link in the route param
router.post('/users/:uid/:rtype/:rid', validate([
    param('uid').isMongoId().trim().withMessage('invalid user id'),
    param('rid').isMongoId().trim().withMessage('invalid recordable id'),
    validateRecordableMeasurementTypes()
]), ((req:Request, res:Response, next:NextFunction) => {
    res.locals["recorder_type"] = RecorderType.User
    //de-pluralise
    switch(req.params.rtype.slice(0, req.params.rtype.length - 1)) {
        case RecordableType.Plant:
            res.locals["recordable_type"] = RecordableType.Plant
            break;
        case RecordableType.Garden:
            res.locals["recordable_type"] = RecordableType.Garden
            break;
        default:
            throw new ErrorHandler(HTTP.BadRequest, `Invalid recordable type: ${req.params.rtype}`);
    }
    next();
}), createMeasurementAsUser)


//devices are assigned to a specific device, whereas users are not
// & can create measurements on any recordable
router.post('/devices/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
    validateRecordableMeasurementTypes(),
    validateDeviceMeasurementTypes()
]), ((req:Request, res:Response, next:NextFunction) => {
    res.locals["recorder_type"] = RecorderType.Device;
    next();
}), authenticateApiKey, createMeasurementAsDevice)


router.get('/types', getMeasurementTypes);

//seconds since unix epoch
router.get('/time', (req:Request, res:Response) => {
    const now = new Date()
    return res.json({data: Math.round(now.getTime() / 1000)})
})

export default router;