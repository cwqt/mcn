import { Request, Response, NextFunction } from "express"
import { Types } from "mongoose";
const { body } = require('express-validator');

import { RecordableType }  from "../models/Recordable.model"
import { validate }         from "../common/validate";
import { IPlant }           from "../models/Plant.model";
import { IGarden }          from "../models/Garden.model";
import { ErrorHandler }     from "../common/errorHandler";
import { HTTP }             from "../common/http";
import { n4j }              from '../common/neo4j';
import { IDeviceStub }  from '../models/Device.model';

import { makePost } from './Posts.controller';
import { IRecordable, IRecordableStub } from '../models/Recordable.model';
import { getDeviceState } from '../controllers/Device.controller';

const getSchema = (recordable_type:string):string => {
    switch(recordable_type) {
        case RecordableType.Plant:     return 'Plant';
        case RecordableType.Garden:    return 'Garden';
        case RecordableType.Device:    return 'Device';
    }
}

export const createRecordable = async (req:Request, res:Response, next:NextFunction) => {
    validate([body('name').not().isEmpty().trim()])(req, res, () => {
        ((req:Request, res:Response, next:NextFunction) => {
            //should really use transactions
            req.body["type"] = res.locals.type;
            req.body["_id"] = new Types.ObjectId().toHexString(),
            req.body["created_at"] = Date.now()

            next();    
        })(req, res, next);
    });
}

export const readRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (r {_id:$rid})
            WHERE r:Plant OR r:Garden
            RETURN r    
        `, {
            rid: req.params.rid
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    let recordable:any = result.records[0]?.get('r').properties;
    if(!recordable) throw new ErrorHandler(HTTP.NotFound, "No such recordable exists");
    if(recordable.parameters) recordable.parameters = JSON.parse(recordable.parameters);

    res.json(recordable);
}

export const updateRecordable = (req:Request, res:Response, next:NextFunction) => {
    res.locals.allowed = ['name', 'images', 'feed_url', 'parameters'];
    next();
}

export const deleteRecordable = (req:Request, res:Response, next:NextFunction) => {
    let session = n4j.session();
    let result;
    try {
        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)
    } finally {
        session.close();
    }

    res.status(HTTP.OK).end()
}

export const heartRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (o:${getSchema(res.locals.type)} {_id:$rid}), (u:User {_id:$uid})
            WHERE o:Plant OR o:Garden OR o:Device
            MERGE (u)-[h:HEARTS]->(o)
        `, {
            rid: req.params.rid ?? req.params.did,
            uid: req.session.user.id,
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)                
    } finally {
        session.close()
    }

    res.status(HTTP.OK).end();
}

export const unheartRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        result = await session.run(`
            MATCH (u:User {_id:$uid})-[h:HEARTS]->(o:${getSchema(res.locals.type)} {_id:$rid})
            WHERE o:Plant OR o:Garden OR o:Device
            DELETE h
        `, {
            rid: req.params.rid ?? req.params.did,
            uid: req.session.user.id,
        })
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)                
    } finally {
        session.close()
    }

    res.status(HTTP.OK).end();
}

export const repostRecordable = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;
    try {
        let post = makePost(req.body.content || '');
    
        result = await session.run(`
            MATCH (o {_id:$rid}), (u:User {_id:$uid})
            WHERE o:Plant OR o:Garden OR o:Device
            CREATE (u)-[:POSTED]->(r:Post $body)-[:REPOST_OF]->(o)
            RETURN r
        `, {
            rid: req.params.rid ?? req.params.did,
            uid: req.session.user.id,
            body: post
        })        
    } catch (e) {
        throw new ErrorHandler(HTTP.ServerError, e)        
    } finally {
        session.close();
    }

    if(!result.records.length) throw new ErrorHandler(HTTP.ServerError, "Did not create repost")
    res.status(201).json(result.records[0].get('r').properties);

}


export const readAllRecordables = async (req:Request, res:Response) => {
    let session = n4j.session();
    let result;

    try {
        result = await session.run(`
            MATCH (r:${getSchema(res.locals.type)})<-[:CREATED]-(:User {_id:$uid})
            WITH r,
                SIZE((r)<-[:REPOST_OF]-(:Post)) AS reposts,
                SIZE((r)<-[:REPLY_TO]-(:Post)) AS replies,
                SIZE((r)<-[:HEARTS]-(:User)) AS hearts                
            RETURN r, hearts, replies, reposts,
                EXISTS ((:User {_id:$selfid})-[:HEARTS]->(r)) AS isHearting,
                EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(r)) AS hasReposted
        `, {
            uid: req.params.uid,
            selfid: req.session.user.id
        })
    } catch(e) {
        throw new ErrorHandler(HTTP.ServerError, e);
    } finally {
        session.close();
    }

    let recordables:IDeviceStub[] | IRecordableStub[] = result.records.map((record:any) => {
        let r = record.get('r').properties;

        let recordable:IDeviceStub | IRecordableStub;
        switch(res.locals.type) {
            case RecordableType.Device:
                recordable =  {
                    _id: r._id,
                    name: r.name,
                    verified: r.verified,
                    created_at: r.created_at,
                    last_ping: r.last_ping,
                    hardware_model: r.hardware_model,
                    measurement_count: r.measurement_count.toNumber(),
                    state: getDeviceState(r),
                    thumbnail: r.thumbnail
                } as IDeviceStub
                break;
            case RecordableType.Garden || RecordableType.Plant:
                recordable = {
                    _id:          r._id,
                    name:         r.name,
                    thumbnail:    r.thumbnail,
                    created_at:   r.created_at,
                    type:         r.type,
                    short_desc:   r.short_desc,                
                } as IRecordableStub
                break;
        }

        recordable.meta = {
            isHearting:  record.get('isHearting') ? true : false,
            hasReposted: record.get('hasReposted') ? true : false,
            hearts:      record.get('hearts').toNumber(),
            reposts:     record.get('reposts').toNumber(),
            replies:     record.get('replies').toNumber(),    
        }

        return recordable;
    })

    res.json(recordables);
}