"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String, required: true },
    pw_hash: { type: String, required: true },
    admin: { type: Boolean, default: false },
    created_at: Date,
    modified_at: Date,
    avatar: String,
}).pre('save', function (next) {
    if (this.isNew) {
        this.created_at = new Date();
    }
    else {
        this.modified_at = new Date();
    }
    next();
});
exports.User = mongoose_1.model("User", exports.UserSchema);
//# sourceMappingURL=User.model.js.map