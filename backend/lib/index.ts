import express          from "express";
import mongoose         from 'mongoose';
import morgan           from 'morgan';
import bodyParser       from 'body-parser';
import cors             from 'cors';
import session          from 'express-session';
import { n4j }          from './common/neo4j';
import log              from './common/logger';

import config           from './config';
import routes           from './routes';
import { handleError, ErrorHandler } from './common/errorHandler';

let server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: config.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: !config.PRODUCTION ? false : true,
        secure: !config.PRODUCTION ? false : true
    }
}))

if(!config.TESTING) app.use(morgan('tiny', { "stream": log.stream }));

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const connection = mongoose.connection;
mongoose.Promise = Promise;

connection.once('open', () => {
    log.info("Connected to MongoDB.")

    try {        
        app.use("/users",       routes.users)
        app.use('/auth',        routes.auth)
        app.use('/time',        routes.time)

        if(config.TESTING) app.use('/test', routes.test)
        
        app.all('*', (req:any, res:any, next:any) => { throw new ErrorHandler(404, 'No such route exists')})
        app.use((err:any, req:any, res:any, next:any) => handleError(err, res));

        process.on('SIGTERM', graceful_exit);
        process.on('SIGINT', graceful_exit);          
        server = app.listen(3000, () => {
            log.info(`Listening on ${config.EXPRESS_PORT}`);
            if(config.TESTING) app.emit('APP_STARTED');
          })        
    } catch (err) {
        log.error(err)
    }
})

function graceful_exit() {
    connection.close(() => {
        server.close();
        n4j.close();
        log.info(`Termination requested, MongoDB connection closed`);
    });
}

module.exports = {
    app: app,
    exit: graceful_exit
};