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

export const updatePlant = async (req:Request, res:Response) => {
    const allowed = ['species', 'garden', ...res.locals.allowed];
    let newData:any = Object.keys(req.body)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: req.body[key]
            }}, {});

    //hack to get nested properties on a node
    if(newData.parameters) newData.parameters = JSON.stringify(newData.parameters);

    console.log(newData)

    let session = n4j.session();
    let result;

    try {
        result = await session.run(`
            MATCH (p:Plant {_id:$rid})
            SET p += $body
            RETURN p
        `, {
            rid: req.params.rid,
            body: newData
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let plant = result.records[0]?.get('p').properties;
    if(!plant) throw new ErrorHandler(HTTP.NotFound)

    //reparse json back into nested object
    plant.parameters = JSON.parse(plant.parameters);
    res.json(plant);
}