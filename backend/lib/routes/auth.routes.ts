import { Router, Request, Response } from 'express';
const { body } = require('express-validator');
const router = Router();

import { generateRecordableSymmetricKey, generateJwt, validateJwt } from '../controllers/Auth.controller'

router.post('/key', generateRecordableSymmetricKey)
router.post("/jwt", generateJwt)
router.get("/jwt/validate", validateJwt, (req:Request, res:Response) => res.status(200).end())

export default router;