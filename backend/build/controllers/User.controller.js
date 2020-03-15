"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = require("../models/User.model");
const { validationResult } = require('express-validator');
exports.readAllUsers = (req, res) => {
    User_model_1.User.find({}, (error, response) => {
        if (error) {
            res.status(400).json({ message: error });
            return;
        }
        return res.json(response);
    });
};
exports.createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //generate password hash
    req.body["salt"] = bcrypt_1.default.genSaltSync(10);
    req.body["pw_hash"] = bcrypt_1.default.hashSync(req.body["password"], req.body["salt"]);
    delete req.body["password"];
    User_model_1.User.create(req.body, (error, response) => {
        if (error) {
            res.status(400).json({ message: error["message"] });
            return;
        }
        res.json(response);
    });
};
exports.readUser = (req, res) => {
    User_model_1.User.find({ _id: req.params.id }, (error, response) => {
        if (error) {
            res.status(400).json({ message: error });
            return;
        }
        return res.json(response);
    });
};
exports.updateUser = (req, res) => {
    var newData = {};
    if (req.body.name) {
        newData.name = req.body.name;
    }
    if (req.body.avatar) {
        newData.avatar = req.body.avatar;
    }
    if (req.body.email) {
        newData.email = req.body.email;
    }
    User_model_1.User.findByIdAndUpdate({ _id: req.params.id }, newData, (error, response) => {
        if (error) {
            res.status(400).json({ message: error });
            return;
        }
        return res.json(response);
    });
};
exports.deleteUser = (req, res) => {
    User_model_1.User.findOneAndDelete({ _id: req.params.id }, (error) => {
        if (error) {
            res.status(400).json({ message: error });
            return;
        }
        return res.status(200).end();
    });
};
//# sourceMappingURL=User.controller.js.map