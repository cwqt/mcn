import { Router } from 'express';
import { validate } from '../common/validate'; 
const { body, param } = require('express-validator');

import { readAllUsers, readUser, createUser, updateUser, deleteUser } from "../controllers/User.controller"

const router = Router();

router.get('/', readAllUsers);

router.post('/', [
    body('username').not().isEmpty().trim().withMessage('username cannot be empty'),
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
], validate, createUser);

router.get('/:id', [
    param('id').isMongoId().trim().withMessage('not a valid oid')
], validate, readUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;