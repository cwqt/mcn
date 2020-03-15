"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const mongoose_1 = require("mongoose");
let extendSchema = require('mongoose-extend-schema'); //no @types
const Recordable_model_1 = require("./Recordable.model");
exports.PlantSchema = new extendSchema(Recordable_model_1.RecordableSchema, {
    type: String,
    species: String,
    in_garden: mongoose.Types.ObjectId(),
});
exports.Plant = mongoose_1.model("Plant", exports.PlantSchema);
//# sourceMappingURL=Plant.model.js.map