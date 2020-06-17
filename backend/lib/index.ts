import express          from "express";
import mongoose         from 'mongoose';
import morgan           from 'morgan';
import bodyParser       from 'body-parser';
import cors             from 'cors';
import session          from 'express-session';
import redis            from 'redis';
import { n4j }          from './common/neo4j';
import log              from './common/logger';
const Influx            = require('influx')

import config           from './config';
import routes           from './routes';
import { handleError, ErrorHandler } from './common/errorHandler';
import logger from "./common/logger";
import { awaitAllDbsConnected } from './common/dbs'; 

let server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(cors());

const redisClient       = redis.createClient();
const redisStore        = require('connect-redis')(session);
app.use(session({
    secret: config.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: !config.PRODUCTION ? false : true,
        secure: !config.PRODUCTION ? false : true
    },
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient,
        ttl: 86400
    }),
}))

if(!config.TESTING) app.use(morgan('tiny', { "stream": log.stream }));

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const mongo = mongoose.connection;
mongoose.Promise = Promise;

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'iot',
});

(async () => {
    await awaitAllDbsConnected(redisClient, mongo, n4j, influx);
    try {        
        app.use('/users',       routes.users);
        app.use('/auth',        routes.auth);
        app.use('/iot',         routes.iot);

        if(config.TESTING) app.use('/test', routes.test)
        
        app.all('*', (req:any, res:any, next:any) => { throw new ErrorHandler(404, 'No such route exists')})
        app.use((err:any, req:any, res:any, next:any) => handleError(err, res));

        process.on('SIGTERM',   graceful_exit);
        process.on('SIGINT',    graceful_exit);

        server = app.listen(3000, () => {
            log.info(`Listening on ${config.EXPRESS_PORT}`);
            if(config.TESTING) app.emit('APP_STARTED');
          })        
    } catch (err) {
        log.error(err)
    }
})();

function graceful_exit() {
    log.info(`Termination requested, closing all connections`);
    mongo.close();
    server.close();
    n4j.close();
    redisClient.quit();
}

module.exports = {
    app: app,
    exit: graceful_exit,
};