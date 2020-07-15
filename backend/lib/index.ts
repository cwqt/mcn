import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import log from "./common/logger";
import db from "./common/dbs";
import http from "http";
import "reflect-metadata";

import config from "./config";
import routes from "./routes";
import { handleError, ErrorHandler } from "./common/errorHandler";
import { awaitAllDbsConnected } from "./common/dbs";

import mcnr from "./routes";

let server: http.Server;
const app = express();
app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: config.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: !config.PRODUCTION ? false : true,
      secure: !config.PRODUCTION ? false : true,
    },
    store: db.redis,
  })
);

if (!config.TESTING) app.use(morgan("tiny", { stream: log.stream }));

(async () => {
  await awaitAllDbsConnected();
  try {
    app.use("/", mcnr.router);
    // app.use("/orgs", routes.orgs);
    // app.use("/users", routes.users);
    // app.use("/auth", routes.auth);
    // app.use("/iot", routes.iot);

    // if (config.TESTING) app.use("/test", routes.test);

    app.all("*", (req: any, res: any, next: any) => {
      throw new ErrorHandler(404, "No such route exists");
    });
    app.use((err: any, req: any, res: any, next: any) => handleError(err, res));

    process.on("SIGTERM", graceful_exit);
    process.on("SIGINT", graceful_exit);

    server = app.listen(3000, () => {
      log.info(`Listening on ${config.EXPRESS_PORT}`);
      if (config.TESTING) app.emit("APP_STARTED");
    });
  } catch (err) {
    log.error(err);
  }
})();

function graceful_exit() {
  log.info(`Termination requested, closing all connections`);
  server.close();
  db.mongo.close();
  db.neo4j.close();
  db.redisClient.quit();
}

module.exports = {
  app: app,
  exit: graceful_exit,
};
