import { Router } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 
var AsyncRouter = require("express-async-router").AsyncRouter;

import {
    // readAllDevices,
    createDevice,
    assignDeviceToRecordable
    // unAssignDeviceFromRecordable,
    // readDevice,
    // updateDevice,
    // deleteDevice,
    // pingDevice
} from "../controllers/Device.controller";

const router = AsyncRouter({mergeParams: true});

// router.get('/', readAllDevices);
router.post('/', validate([
    body('name').not().isEmpty().trim().withMessage('device must have friendly name'),
]), createDevice);

router.post('/:did/assign/:rid', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
    param('rid').isMongoId().trim().withMessage('invalid recordable id to assign to')
]), assignDeviceToRecordable)

// router.delete('/:did/monitor/:rid', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id'),
//     param('rid').isMongoId().trim().withMessage('invalid recordable id to assign to')
// ]))

// router.get('/:did', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id')
// ]), readDevice);

// router.put('/:did', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id')
// ]), updateDevice);

// router.delete('/:did', validate([
//     param('did').isMongoId().trim().withMessage('invalid device id')
// ]), deleteDevice);

// router.get('/:did/ping',  pingDevice)

// router.get('/:plant_id/measurements',   readMeasurements)
// router.post('/:plant_id/measurements',  createMeasurement)

// router.get('/:plant_id/measurements',   readEvents)

export default router;