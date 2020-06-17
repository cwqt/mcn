import { RedisClient } from "redis";
import mongoose from "mongoose";
import log from './logger';
import logger from "./logger";
import { cypher } from "./neo4j";

let dbs = {
    redis: false,
    mongo: false,
    neo4j: false,
    influx: false
}

export const awaitAllDbsConnected = async (redis:RedisClient, mongo:mongoose.Connection, neo4j:any, influx:any, itrlimit:number=10, delay:number=1000) => {
    let itrs:number = 0;
    
    while(Object.values(dbs).every((val) => val === false)) {
        log.info(`Attempting to connect...${itrs}/${itrlimit}:\n${JSON.stringify(dbs)}`)

        if(!dbs.redis) redis.on('connect', () => dbs.redis = true);
        if(!dbs.mongo) mongo.once('connected', () => dbs.mongo = true);
        
        if(!dbs.neo4j) {
            let x = await cypher(`RETURN 1`, {})
            if(x) dbs.neo4j = true;
        }

        if(!dbs.influx) {
            dbs.influx = true;
        }

        itrs++;
        if(itrs == itrlimit) throw new Error("Exceeded iterations for DB connections");
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}