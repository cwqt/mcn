import { Router } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 

import {
    readAllDevices,
    createDevice,
    readDevice,
    updateDevice,
    deleteDevice,
    pingDevice
} from "../controllers/Device.controller";

const router = Router({mergeParams: true});

router.get('/', readAllDevices);
router.post('/', validate([
    body('friendly_name').not().isEmpty().trim().withMessage('device must have friendly name'),
]), createDevice);

router.get('/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid device id')
]), readDevice);

router.put('/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid device id')
]), updateDevice);

router.delete('/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid device id')
]), deleteDevice);

router.get('/:did/ping',  pingDevice)

// router.get('/:plant_id/measurements',   readMeasurements)
// router.post('/:plant_id/measurements',  createMeasurement)

// router.get('/:plant_id/measurements',   readEvents)

export default router;