import { Router } from 'express';
const { body, param, query } = require('express-validator');
import { validate } from '../common/validate'; 

import {
    readAllDevices,
    createDevice,
    readDevice,
    updateDevice,
    deleteDevice
} from "../controllers/Device.controller";

const router = Router({mergeParams: true});

router.get('/', readAllDevices);
router.post('/', [
    body('friendly_name').not().isEmpty().trim().withMessage('device must have friendly name'),
], validate, createDevice);

router.get('/:did', [
    param('did').isMongoId().trim().withMessage('invalid device id')
], validate, readDevice);

router.put('/:did', [
    param('did').isMongoId().trim().withMessage('invalid device id')
], validate, updateDevice);

router.delete('/:did', [
    param('did').isMongoId().trim().withMessage('invalid device id')
], validate, deleteDevice);

export default router;