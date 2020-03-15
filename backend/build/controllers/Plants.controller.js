"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plant_model_1 = require("../models/Plant.model");
const { validationResult } = require('express-validator');
exports.createPlant = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Plant_model_1.Plant.create(req.body, (error, response) => {
        if (error) {
            res.status(400).json({ message: error["message"] });
            return;
        }
        res.json(response);
    });
};
exports.readPlant = (req, res) => {
    Plant_model_1.Plant.findById(req.params.plant_id, (error, plant) => {
        if (error) {
            res.status(400).json({ message: error["message"] });
            return;
        }
        return res.json(plant);
    });
};
exports.updatePlant = (req, res) => { };
exports.deletePlant = (req, res) => { };
//# sourceMappingURL=Plants.controller.js.map