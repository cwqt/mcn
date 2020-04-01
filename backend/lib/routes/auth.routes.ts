import { Router, Request, Response } from 'express';
const { body, query } = require('express-validator');

import { validate } from '../common/validate';
import { generateRecordableSymmetricKey, generateJwt, validateJwt } from '../controllers/ApiKeys.controller'

const router = Router();

// api keys
router.post("/keys/", generateRecordableSymmetricKey)
router.post("/keys/jwt", generateJwt)
router.get("/keys/jwt/validate", validateJwt, (req:Request, res:Response) => res.status(200).end())

//session
router.get("/session")

export default router;