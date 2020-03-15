"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let extendSchema = require('mongoose-extend-schema'); //no @types
const Recordable_model_1 = require("./Recordable.model");
exports.GardenSchema = extendSchema(Recordable_model_1.RecordableSchema, {
    plants: Array,
    type: String
});
exports.Garden = mongoose_1.model("Garden", exports.GardenSchema);
//# sourceMappingURL=Garden.model.js.map