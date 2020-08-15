import { getMcnMongoSchema, IMcnMongoSchema } from "@cxss/interfaces";
import redis, { RedisClient } from "redis";
import mongoose, { Schema } from "mongoose";
import log from "./logger";
import session from "express-session";
import config from "../config";
import { ErrorHandler } from "./errorHandler";
import { HTTP } from "./http";
import neo4j from "neo4j-driver";
import { Transaction, Result } from "neo4j-driver";
import * as Influx from "influx";

const n4j = neo4j.driver("neo4j://localhost", neo4j.auth.basic(config.N4J_USER, config.N4J_PASS));
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);
const Redis = new redisStore({
  host: "localhost",
  port: 6379,
  client: redisClient,
  ttl: 86400,
});

const influx = new Influx.InfluxDB({
  host: "localhost",
  database: "iot",
});

mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const mongo = mongoose.connection;
mongoose.Promise = Promise;

let dbs = {
  redis: false,
  mongo: false,
  neo4j: false,
  influx: false,
};

export const MSchemas: IMcnMongoSchema = getMcnMongoSchema(require("mongoose"));

export const awaitAllDbsConnected = async (itrlimit: number = 10, delay: number = 1000) => {
  let itrs: number = 0;

  while (Object.values(dbs).every((val) => val === false)) {
    log.info(`Attempting to connect...${itrs}/${itrlimit}:\n${JSON.stringify(dbs)}`);

    if (!dbs.redis) redisClient.on("connect", () => (dbs.redis = true));
    if (!dbs.mongo)
      mongo.once("connected", () => {
        dbs.mongo = true;
      });

    if (!dbs.neo4j) {
      let x = await cypher(`RETURN 1`, {});
      if (x) dbs.neo4j = true;
    }

    if (!dbs.influx) {
      dbs.influx = true;
    }

    itrs++;
    if (itrs == itrlimit) throw new Error("Exceeded iterations for DB connections");
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

// neo4j helpers
export const cypher = async (query: string, fields: any): Promise<Result> => {
  let result: any;
  let session = n4j.session();
  try {
    result = await session.run(query, fields);
  } catch (e) {
    throw new ErrorHandler(HTTP.ServerError, e);
  } finally {
    session.close();
  }
  return result;
};

export const sessionable = async <T>(
  f: (t: Transaction) => Promise<T>,
  txc?: Transaction
): Promise<T> => {
  if (!txc) {
    const session = n4j.session();
    try {
      const txc = session.beginTransaction();
      const res = await f(txc);
      await txc.commit();
      return res;
    } catch (error) {
      throw new Error(error);
    } finally {
      await session.close();
    }
  } else {
    f(txc);
  }
};

export default {
  redis: Redis,
  redisClient: redisClient,
  neo4j: n4j,
  influx: influx,
  mongo: mongo,
};
