import { Router } from 'express';
import { validate } from '../common/validate'; 
const { body, param, query } = require('express-validator');

import {
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

router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
], validate, loginUser)

router.post('/logout', logoutUser)

router.get('/:uid', [
    param('uid').isMongoId().trim().withMessage('not a valid oid')
], validate, readUser);

router.put('/:uid', [
    param('uid').isMongoId().trim().withMessage('not a valid oid')
], validate, updateUser);

router.delete('/:uid', [
    param('uid').isMongoId().trim().withMessage('not a valid oid')
], validate, deleteUser);


export default router;