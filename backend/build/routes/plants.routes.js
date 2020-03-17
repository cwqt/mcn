"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { body } = require('express-validator');
const Plants_controller_1 = require("../controllers/Plants.controller");
const plants = express_1.Router();
plants.use((req, res, next) => {
    res.locals.type = 'plant';
    next();
});
plants.get('/:plant_id', Plants_controller_1.readPlant);
plants.post('/', [
    body('name').not().isEmpty().trim(),
    body('belongs_to').not().isEmpty().trim(),
    body('species').not().isEmpty().trim(),
], Plants_controller_1.createPlant);
plants.put('/:plant_id', Plants_controller_1.updatePlant);
plants.delete('/:plant_id', Plants_controller_1.deletePlant);
exports.default = plants;
//# sourceMappingURL=plants.routes.js.map