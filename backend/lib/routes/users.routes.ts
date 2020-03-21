import { Router } from 'express';
const { body } = require('express-validator');

import { readAllUsers, readUser, createUser, updateUser, deleteUser } from "../controllers/User.controller"

const router = Router();

router.get('/', readAllUsers);
router.post('/', [
    body('name').not().isEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().isLength({ min: 6 })
], createUser);
router.get('/:id', readUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;