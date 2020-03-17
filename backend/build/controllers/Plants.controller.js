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
exports.updatePlant = (req, res) => {
    const newData = {};
    if (req.body.name)
        newData.name = req.body.name;
    if (req.body.recording)
        newData.recording = req.body.recording;
    if (req.body.species)
        newData.species = req.body.species;
    if (req.body.image)
        newData.image = req.body.image;
    if (req.body.feed_url)
        newData.feed_url = req.body.feed_url;
    if (req.body.host_url)
        newData.host_url = req.body.host_url;
    if (req.body.parameters)
        newData.parameters = req.body.parameters;
    if (req.body.in_garden)
        newData.in_garden = req.body.in_garden;
    Plant_model_1.Plant.findByIdAndUpdate(req.params.plant_id, newData, { new: true }, (error, plant) => {
        if (error) {
            res.status(400).json({ message: error["message"] });
            return;
        }
        res.json(plant);
    });
};
exports.deletePlant = (req, res) => {
    Plant_model_1.Plant.findByIdAndDelete(req.params.plant_id, (error, response) => {
        if (error) {
            res.status(400).json({ message: error["message"] });
            return;
        }
        return res.json(response);
    });
};
//# sourceMappingURL=Plants.controller.js.map