"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
var server;
const app = express_1.default();
app.set('trust proxy', 1);
app.use(body_parser_1.default.json());
app.use(morgan_1.default("tiny"));
mongoose_1.default.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose_1.default.connection;
mongoose_1.default.Promise = Promise;
connection.once('open', () => {
    console.log("Connected to MongoDB.");
    try {
        app.use("/users", routes_1.default.users);
        app.use("/plants", routes_1.default.plants);
        app.use("/gardens", routes_1.default.gardens);
        app.use('/events', routes_1.default.events);
        app.use('/measurements', routes_1.default.measurements);
        process.on('SIGTERM', graceful_exit);
        process.on('SIGINT', graceful_exit);
        server = app.listen(3000, () => {
            console.log('Listening on 3000');
        });
    }
    catch (err) {
        console.log(err);
    }
});
function graceful_exit() {
    connection.close(() => {
        console.log(`Termination requested, MongoDB connection closed`);
        server.close();
    });
}
//# sourceMappingURL=index.js.map