import { Job } from "agenda";
import { cypher } from "../common/neo4j";
import { TaskState } from "../models/Tasks.model";

export const runTask = async (job:Job) => {
    console.log('hello world')

    //*0.. - task could be last in routine
    let result =  await cypher(`
        MATCH (t:Task {_id:$tid})-[:NEXT*0..]-(:Task)-[:END]->(tr:TaskRoutine)
        OPTIONAL MATCH (endNode:Task)-[:END]->(:TaskRoutine)
        RETURN t, tr, endNode`,
    {
        tid: job.attrs.data._id
    });

    let taskRoutine = result.records[0]?.get('tr')
    let currentTask = result.records[0]?.get('t');
    let lastTask    = result.records[0]?.get('endNode');

    let task;

    if(lastTask.properties._id == job.attrs.data._id) {
        //final task in queue
        task = lastTask.properties;
    } else {
        //somewhere in the middle
        task = currentTask.properties
    }

    await cypher(`
        MATCH (t:Task {_id:$tid})
        SET t.state = $state
    `, {
        tid: task._id,
        state: TaskState.Pending
    })
    
    // do the task
    await executeTaskCommand(task.command);
}


const executeTaskCommand = async (command:string) => {
    await timeout(1000);
    console.log(command);
}

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}