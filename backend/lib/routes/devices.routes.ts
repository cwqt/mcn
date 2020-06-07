import { Router, NextFunction, Request, Response } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 
var AsyncRouter = require("express-async-router").AsyncRouter;

import { readAllMeasurements } from '../controllers/Device/Measurements.controller';
import {
    createDevice,
    assignDeviceToRecordable,
    readDevice,
    pingDevice,
    readDeviceSensors,
    readDeviceStates,
    readDeviceMetrics,
    // updateDevice,
    // deleteDevice,
} from "../controllers/Device/Device.controller";
import {
    createApiKey,
    readApiKey,
    deleteApiKey
} from '../controllers/Device/ApiKeys.controller';
import {
    createSensor,
    updateSensor,
    deleteSensor
} from '../controllers/Device/Sensor.controller';

import { RecordableType } from '../models/Recordable.model';
import { readAllRecordables } from '../controllers/Recordables/Recordable.controller';
import { heartPostable, unheartPostable, repostPostable } from '../controllers/Postable.controller';

import routines    from './routines.routes';
import { Measurement, MeasurementUnits, IoTMeasurement, IoTState, Unit } from '../common/types/measurements.types';
import { HardwareInformation } from '../common/types/hardware.types';

const router = AsyncRouter({mergeParams: true});
router.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.type = RecordableType.Device
    next();
})

router.get('/', readAllRecordables);
router.post('/', validate([
    body('name').not().isEmpty().trim().withMessage('device must have friendly name'),
    body('hardware_model')
        .not().isEmpty().withMessage('Must have hardware model')
        .custom((model:string, { req }:any) => {
            if(!Object.keys(HardwareInformation).includes(model)) throw new Error('Un-supported hardware model')
            return true;
        })
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
deviceRouter.post('/repost',        repostPostable);
deviceRouter.post('/heart',         heartPostable);
deviceRouter.delete('/heart',       unheartPostable);

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
    body('key_name').not().isEmpty().trim().withMessage('device name must be named'),
]), createApiKey)

deviceRouter.post('/sensors', validate([
    body('name').not().isEmpty().withMessage('Sensor requires a name'),
    body('measures')
        .not().isEmpty().withMessage('Must have measurement type')
        .isIn(Object.values(Measurement)).withMessage(`Must be valid measurement type: ${Object.values(Measurement)}`),
    body('unit')
        .not().isEmpty().withMessage('Must have measurement unit')
        .custom((value:Unit, { req }:any) => {
            let type = req.body.measures as Measurement | IoTMeasurement | IoTState;
            let isValidUnitForType =  MeasurementUnits[type].includes(value);
            if(!isValidUnitForType) throw new Error(`'${value}' is not a valid unit for '${req.body.measures}', should be of value: ${MeasurementUnits[type]}`);
            return true;
        })
]), createSensor);

deviceRouter.get('/sensors', readDeviceSensors);
deviceRouter.get('/states',  readDeviceStates);
deviceRouter.get('/metrics', readDeviceMetrics);

deviceRouter.use('/routines', routines);

// API KEYS =======================================================================================
const keyRouter = AsyncRouter({mergeParams:true});
deviceRouter.use('/keys/:kid', keyRouter);

keyRouter.use(validate([
    param('kid').isMongoId().trim().withMessage('invalid key id'),
]));

keyRouter.get('/',      readApiKey)
keyRouter.delete('/',   deleteApiKey)

// SENSORS ========================================================================================
const sensorRouter = AsyncRouter({mergeParams:true})
deviceRouter.use('/sensors/:sid', sensorRouter);

sensorRouter.put('/', updateSensor);
sensorRouter.delete('/', deleteSensor);

export default router;