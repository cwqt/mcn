import { Router, Request, Response } from 'express';
const { body, query } = require('express-validator');

import { validate } from '../common/validate';
import { generateRecordableSymmetricKey, generateJwt, validateJwt } from '../controllers/Auth.controller'
import { verify } from '../controllers/Email.controller';

const router = Router();

router.post('/key', generateRecordableSymmetricKey)
router.post("/jwt", generateJwt)
router.get("/jwt/validate", validateJwt, (req:Request, res:Response) => res.status(200).end())

router.get("/verify", [
    query('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    query('hash').not().isEmpty().trim().withMessage('must have a verification hash'),
], validate, verify)

export default router;