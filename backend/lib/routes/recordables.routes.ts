import { Router } from 'express';
const { body } = require('express-validator');

import { RecordableTypes } from '../models/Recordable.model';

const router = Router();

const useRoute = (recordable_type:string):string => {
    recordable_type = parseInt(recordable_type);
    if(recordable_type == RecordableTypes.Plant) return 'plants';
    if(recordable_type == RecordableTypes.Garden) return 'gardens';
}

router.get(`/plants`)

export default router;