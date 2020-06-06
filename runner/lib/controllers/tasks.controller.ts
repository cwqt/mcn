import { Response, Request } from "express";
import { cypher } from "../common/neo4j";

export const markTaskComplete = async (req:Request, res:Response) => {
    let taskState = res.locals.state;

    let result = await cypher(`
        MATCH (t:Task {_id:$tid})
        SET t.state = $taskState
        RETURN t
    `, {
        tid: req.params.tid,
        taskState: taskState
    })

    res.status(200).end()
}