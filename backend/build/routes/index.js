"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./users"));
const plants_routes_1 = __importDefault(require("./plants.routes"));
const gardens_routes_1 = __importDefault(require("./gardens.routes"));
const events_routes_1 = __importDefault(require("./events.routes"));
const measurements_routes_1 = __importDefault(require("./measurements.routes"));
exports.default = {
    users: users_1.default,
    plants: plants_routes_1.default,
    gardens: gardens_routes_1.default,
    events: events_routes_1.default,
    measurements: measurements_routes_1.default,
};
//# sourceMappingURL=index.js.map