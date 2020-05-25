import { Job }      from "agenda"
import { cypher }   from "../common/neo4j"
import agenda       from '../agenda';
import {
    Jobs, TaskState }          from "../models/Tasks.model";


export const runRoutine = async (job:Job) => {
    //find first task in routine
    let result = await cypher(`
        MATCH (t:Task)<-[:START]-(tr:TaskRoutine {_id:$trid})
        RETURN t, tr
    `, {
        trid: job.attrs.data._id
    })

    if(!result.records[0]?.get('t')) throw new Error('No starting Task in TaskRoutine');
    if(result.records[0]?.get('tr').properties.locked) throw new Error('Cannot run Routine already in progress');

    await cypher(`
        MATCH (tr:TaskRoutine {_id:$trid})
        SET tr.locked = true
        SET tr.state = $state
    `, {
        trid: job.attrs.data._id,
        state: TaskState.Pending
    })

    const task = await agenda.instance.create(Jobs.Task, result.records[0].get('t').properties)
    task.save();
}

export const runSubRoutine = async (job:Job) => {}