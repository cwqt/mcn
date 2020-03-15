"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { body } = require('express-validator');
const Recordable_controller_1 = require("../controllers/Recordable.controller");
const plants = express_1.Router();
plants.use((req, res, next) => {
    res.locals.type = 'plant';
    next();
});
plants.get('/:recordable_id', Recordable_controller_1.readRecordable);
plants.post('/', [
    body('name').not().isEmpty().trim(),
    body('species').not().isEmpty().trim(),
], Recordable_controller_1.createRecordable);
plants.delete('/:recordable_id', Recordable_controller_1.deleteRecordable);
plants.put('/:recordable_id', Recordable_controller_1.updateRecordable);
exports.default = plants;
//# sourceMappingURL=plants.routes.js.map