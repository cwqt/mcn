import Agenda, { Job }  from 'agenda';
import config       from './config';
import { runTask }  from "./logic/tasks.logic";
import { log }      from './common/logger';
import { cypher }   from './common/neo4j';
import {
    ITaskRoutine,
    Jobs }          from "./models/Tasks.model";
import {
    runRoutine,
    runSubRoutine } from "./logic/routines.logic";


const agenda = new Agenda({db: {address: config.MONGO_URL}});


agenda.define(Jobs.Routine,     async job => await runRoutine(job));
agenda.define(Jobs.Subroutine,  async job => await runSubRoutine(job));
agenda.define(Jobs.Task,        async job => await runTask(job));

agenda.on('start',      job => log.agenda(`Job ${job.attrs.name}:${job.attrs.data._id} starting`, ));
agenda.on('complete',   job => log.agenda(`Job ${job.attrs.name}:${job.attrs.data._id} finished`));
agenda.on('fail',       (err, job) => log.error(`Job ${job.attrs.name} failed with error: ${err.message}`));

const collectTaskRoutines = async () => {
    let result = await cypher(`
        MATCH (d:Device)<-[:HAS_ROUTINE]-(t:TaskRoutine)-[:START]->(:Task)
        SET t.locked = false
        RETURN d, t
    `, {});

    log.info(`Got ${result.records.length} TaskRoutine(s) from Neo4j`);

    //push all TaskRoutines into agenda
    let taskRoutines:any[] = [];
    result.records.forEach((record:any) => {
        taskRoutines.push((async () => {
            const routine:ITaskRoutine = record.get('t').properties;
            const job:Job = await agenda.create(Jobs.Routine, routine)
                // .repeatEvery(routine.cron, {
                //     timezone: routine.timezone,
                //     skipImmediate: true
                // })
                .run()
                // .save()
            return job;
        })())
    })

    await Promise.all(taskRoutines);
}

export default {
    instance: agenda,
    collectTaskRoutines: collectTaskRoutines
}