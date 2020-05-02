import { Request, Response }    from "express"

import { IPlant }       from '../models/Plant.model'
import { ErrorHandler } from "../common/errorHandler";
import { HTTP }         from "../common/http";
import { n4j }          from '../common/neo4j';

export const createPlant = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})
            CREATE (p:Plant $body)<-[:CREATED]-(u)
            return p
        `, {
            uid: req.params.uid,
            body: req.body
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let plant:IPlant = result.records[0].get('p').properties;
    res.status(HTTP.Created).json(plant);
}

export const updatePlant = (req:Request, res:Response) => {
}
