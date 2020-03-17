"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { body } = require('express-validator');
const Gardens_controller_1 = require("../controllers/Gardens.controller");
const gardens = express_1.Router();
gardens.use((req, res, next) => {
    res.locals.type = 'garden';
    next();
});
gardens.get('/:garden_id', Gardens_controller_1.readGarden);
gardens.post('/', [
    body('name').not().isEmpty().trim(),
    body('belongs_to').not().isEmpty().trim(),
], Gardens_controller_1.createGarden);
gardens.put('/:garden_id', Gardens_controller_1.updateGarden);
gardens.delete('/:garden_id', Gardens_controller_1.deleteGarden);
gardens.get('/:garden_id/plants', Gardens_controller_1.readGardenPlants);
exports.default = gardens;
//# sourceMappingURL=gardens.routes.js.map