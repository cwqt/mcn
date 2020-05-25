import express          from "express";
import mongoose         from 'mongoose';
import morgan           from 'morgan';
import bodyParser       from 'body-parser';
import cors             from 'cors';
import { n4j }  from './common/neo4j';
import {log, logger}    from './common/logger';

import config           from './config';
import routes           from './routes';
import { handleError, ErrorHandler } from './common/errorHandler';

import agenda from './agenda';
const Agendash = require('agendash');


let server:any;
const app = express();
app.set('trust proxy', 1);

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny', { "stream": logger.stream }));

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const connection = mongoose.connection;
mongoose.Promise = Promise;

connection.once('open', async () => {
    log.info("Connected to MongoDB")
    try {
        await connection.collection('agendaJobs').drop();
    } catch(e) {
        console.log(e);
    }

    await agenda.instance.start();
    log.info("Agenda started");

    await agenda.collectTaskRoutines();

    try {
        app.use('/jobs',       routes.jobs);
        // app.use('/dash',       Agendash(agenda.instance))
        
        app.use((err:any, _:any, res:any) => handleError(err, res));
        process.on('SIGTERM', graceful_exit);
        process.on('SIGINT', graceful_exit);          
        server = app.listen(config.EXPRESS_PORT, () => {
            log.info(`Listening on ${config.EXPRESS_PORT}`);
          })        
    } catch (err) {
        log.error(err)
    }
})

const graceful_exit = () => {
    connection.close(() => {
        server.close();
        n4j.close();
        log.info(`Termination requested, MongoDB & Neo4j connection closed`);
    });
}

module.exports = {
    app: app,
    exit: graceful_exit
};