import config from '../config';
import { ErrorHandler } from './errorHandler';
import { HTTP } from './http';
var neo4j = require('neo4j-driver')

export const n4j = neo4j.driver('neo4j://localhost', neo4j.auth.basic(config.N4J_USER, config.N4J_PASS));

export const cypher = async (query:string, fields:any) => {
    let result:any;
    let session = n4j.session();
    try {
        result = session.run(query, fields);
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }
    return result;
}