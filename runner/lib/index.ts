import express          from "express";
import mongoose         from 'mongoose';
import morgan           from 'morgan';
import bodyParser       from 'body-parser';
import cors             from 'cors';
import { n4j, cypher }          from './common/neo4j';
import log              from './common/logger';
import Agenda, { Job }          from 'agenda';

import config           from './config';
import routes           from './routes';
import { handleError, ErrorHandler } from './common/errorHandler';
import { runRoutine, runSubRoutine } from "./logic/routines.logic";
import { runTask } from "./logic/tasks.logic";
import { ITaskRoutine, Jobs } from "./models/Tasks.model";

let server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(cors());

app.use(morgan('tiny', { "stream": log.stream }));

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const connection = mongoose.connection;
mongoose.Promise = Promise;

const agenda = new Agenda({db: {address: config.MONGO_URL}});

agenda.define(Jobs.Routine,     async job => await runRoutine(job));
agenda.define(Jobs.Subroutine,  async job => await runSubRoutine(job));
agenda.define(Jobs.Task,        async job => await runTask(job));

agenda.on('start',      job => log.info('Job %s starting', job.attrs.name));
agenda.on('complete',   job => log.info(`Job ${job.attrs.name} finished`));
agenda.on('fail',       err => log.error(`Job failed with error: ${err.message}`));

connection.once('open', async () => {
    log.info("Connected to MongoDB")
    await agenda.start();
    log.info("Agenda started")

    let result = await cypher(`
        MATCH (d:Device)<-[:HAS_ROUTINE]-(t:TaskRoutine)-[:START]->(:Task)
        RETURN d, t
    `, {});

    log.info(`Got ${result.records.length} TaskRoutine's`);

    //push all TaskRoutines into agenda
    let taskRoutines:any[] = [];
    result.records.forEach((record:any) => {
        taskRoutines.push(async () => {
            const routine:ITaskRoutine = record.get('t').properties;
            const job:Job = await agenda.create(Jobs.Routine)
                .repeatEvery(routine.cron, {
                    timezone: routine.timezone,
                    skipImmediate: true
                }).save()
            return job;
        })
    })

    await Promise.all(taskRoutines);

    try {
        app.use('/jobs',       routes.jobs);
        
        app.use((err:any, _:any, res:any) => handleError(err, res));

        process.on('SIGTERM', graceful_exit);
        process.on('SIGINT', graceful_exit);          
        server = app.listen(3000, () => {
            log.info(`Listening on ${config.EXPRESS_PORT}`);
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