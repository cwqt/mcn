"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let extendSchema = require('mongoose-extend-schema'); //no @types
const Recordable_model_1 = require("./Recordable.model");
exports.PlantSchema = new extendSchema(Recordable_model_1.RecordableSchema, {
    type: String,
    species: String,
    in_garden: mongoose_1.Schema.Types.ObjectId,
});
exports.Plant = mongoose_1.model("Plant", exports.PlantSchema);
//# sourceMappingURL=Plant.model.js.map