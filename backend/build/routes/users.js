"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { body } = require('express-validator');
const User_controller_1 = require("../controllers/User.controller");
const router = express_1.Router();
router.get('/', User_controller_1.readAllUsers);
router.post('/', [
    body('name').not().isEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().isLength({ min: 6 })
], User_controller_1.createUser);
router.get('/:id', User_controller_1.readUser);
router.put('/:id', User_controller_1.updateUser);
router.delete('/:id', User_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map