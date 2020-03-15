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
exports.MeasurementSchema = new mongoose_1.Schema({
    belongs_to: mongoose.Types.ObjectId(),
    timestamp: Number,
    event_type: String
});
exports.Meaurements = mongoose_1.model("Measurement", exports.MeasurementSchema);
//# sourceMappingURL=Measurement.js.map