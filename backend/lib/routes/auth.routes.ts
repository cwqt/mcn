import { Router, Request, Response } from 'express';
const { body } = require('express-validator');
const router = Router();

import { generateRecordableSymmetricKey } from '../controllers/Auth.controller'

router.post('/auth/key', generateRecordableSymmetricKey)



export default router;