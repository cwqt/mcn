import { Request, Response } from 'express';

const { body, query } = require('express-validator');
var AsyncRouter = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';
// import { generateRecordableSymmetricKey, generateJwt, validateJwt } from '../controllers/ApiKeys.controller'
import { verifyUserEmail } from '../controllers/Email.controller';

const router = AsyncRouter();

// api keys
// router.post("/keys/", generateRecordableSymmetricKey)
// router.post("/keys/jwt", generateJwt)
// router.get("/keys/jwt/validate", validateJwt, (req:Request, res:Response) => res.status(200).end())

router.get("/verify", validate([
    query('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    query('hash').not().isEmpty().trim().withMessage('must have a verification hash'),
]), verifyUserEmail)

//session
// router.get("/session")

export default router;