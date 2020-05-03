import { Router } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 
var AsyncRouter = require("express-async-router").AsyncRouter;

import {
    readAllDevices,
    createDevice,
    assignDeviceToRecordable,
    readDevice,
    readLatestMeasurementFromDevice
    // unAssignDeviceFromRecordable,
    // readDevice,
    // updateDevice,
    // deleteDevice,
    // pingDevice
} from "../controllers/Device.controller";

import {
    createApiKey,
    readApiKey,
    deleteApiKey
} from '../controllers/ApiKeys.controller';

const router = AsyncRouter({mergeParams: true});

router.get('/', readAllDevices);
router.post('/', validate([
    body('name').not().isEmpty().trim().withMessage('device must have friendly name'),
]), createDevice);

router.get('/:did', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
]), readDevice)

router.get('/:did/latest', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
]), readLatestMeasurementFromDevice)

router.post('/:did/assign/:rid', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
    param('rid').isMongoId().trim().withMessage('invalid recordable id to assign to')
]), assignDeviceToRecordable)

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


router.post('/:did/keys', validate([
    param('did').isMongoId().trim().withMessage('invalid device id'),
    body('recordable_type').not().isEmpty().trim().withMessage('device must have recordable type of enum "plant" | "garden"'),
    body('key_name').not().isEmpty().trim().withMessage('device name must be named'),
]), createApiKey)

router.get('/:did/keys/:kid', validate([
    param('did').isMongoId().trim().withMessage('invalid key id'),
]), readApiKey)

router.delete('/:did/keys/:kid', validate([
    param('did').isMongoId().trim().withMessage('invalid key id'),
]), deleteApiKey)

export default router;