require("dotenv").config();
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
import { handleError, ErrorHandler } from "./common/errorHandler";
import { awaitAllDbsConnected } from "./common/dbs";

import mcnr from "./routes";
import { HTTP } from "./common/http";
import { IFarmStub, IFarm } from "@cxss/interfaces";
import { Farm } from "./classes/Hydroponics/Farm.model";

(async () => {
  let x = new Farm<IFarmStub>("cool farm").asStub().read().reduce();
  // console.log(x);
  // console.log("\n---------------\n");
  // let y = await new Farm<IFarm>("cooler farm").reduce();
  // console.log(y);
})();

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

app.use(morgan("tiny", { stream: log.stream }));

(async () => {
  await awaitAllDbsConnected();
  try {
    app.use("/", mcnr.router);

    app.all("*", (req: any, res: any, next: any) => {
      handleError(req, res, next, new ErrorHandler(HTTP.NotFound, "No such route exists"));
    });
    app.use((err: any, req: any, res: any, next: any) => handleError(req, res, next, err));

    process.on("SIGTERM", graceful_exit);
    process.on("SIGINT", graceful_exit);

    server = app.listen(3000, () => {
      log.info(`Listening on ${config.EXPRESS_PORT}`);
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
