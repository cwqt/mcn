"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var RecordableTypes;
(function (RecordableTypes) {
    RecordableTypes[RecordableTypes["Garden"] = 0] = "Garden";
    RecordableTypes[RecordableTypes["Plant"] = 1] = "Plant";
})(RecordableTypes = exports.RecordableTypes || (exports.RecordableTypes = {}));
exports.RecordableSchema = new mongoose_1.Schema({
    name: String,
    belongs_to: mongoose_1.Schema.Types.ObjectId,
    created_at: Date,
    modified_at: Date,
    image: String,
    feed_url: String,
    host_url: String,
    recording: [String],
    parameters: Object,
}).pre('save', function (next) {
    if (this.isNew) {
        this.created_at = new Date();
    }
    else {
        this.modified_at = new Date();
    }
    next();
});
exports.Recordable = mongoose_1.model("Recordable", exports.RecordableSchema);
//# sourceMappingURL=Recordable.model.js.map