import { Router } from 'express';
import { validate } from '../common/validate'; 
const { body, param, query } = require('express-validator');

import {
    verifyUser,
    readAllUsers,
    readUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser } from "../controllers/User.controller";

const router = Router();

router.get('/', readAllUsers);

router.post('/', [
    body('username').not().isEmpty().trim().withMessage('username cannot be empty'),
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
], validate, createUser);

// email verification
router.get("/:uid/verify", [
    query('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    query('hash').not().isEmpty().trim().withMessage('must have a verification hash'),
], validate, verifyUser)

router.post('/:uid/login', [
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
], validate, loginUser)

router.post('/:uid/logout', logoutUser)

router.get('/:id', [
    param('id').isMongoId().trim().withMessage('not a valid oid')
], validate, readUser);

router.put('/:id', [
    param('id').isMongoId().trim().withMessage('not a valid oid')
], validate, updateUser);

router.delete('/:id', [
    param('id').isMongoId().trim().withMessage('not a valid oid')
], validate, deleteUser);


export default router;