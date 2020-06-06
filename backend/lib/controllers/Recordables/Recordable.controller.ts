import { Request, Response, NextFunction } from "express"
import { Types }    from "mongoose";
import { body }     from 'express-validator';

import config               from "../../config";
import { RecordableType, IPaginator }   from "../../models/Recordable.model"
import { IDeviceStub }      from '../../models/Device/Device.model';
import { IRecordableStub }  from '../../models/Recordable.model';
import { validate }         from "../../common/validate";
import { ErrorHandler }     from "../../common/errorHandler";
import { HTTP }             from "../../common/http";
import { n4j, cypher }              from '../../common/neo4j';
import { getDeviceState }   from '../Device/Device.controller';
import { getN4jNodeName }   from '../Postable.controller'



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
    let result = await cypher(`
        MATCH (r {_id:$rid})
        WHERE r:Plant OR r:Garden
        RETURN r    
    `, {
        rid: req.params.rid
    })

    let recordable:any = result.records[0]?.get('r').properties;
    if(!recordable) throw new ErrorHandler(HTTP.NotFound, "No such recordable exists");
    if(recordable.parameters) recordable.parameters = JSON.parse(recordable.parameters);

    res.json(recordable);
}

export const updateRecordable = async (req:Request, res:Response, next:NextFunction) => {
    res.locals.allowed = ['name', 'images', 'feed_url', 'parameters'];
    next();
}

export const deleteRecordable = async (req:Request, res:Response, next:NextFunction) => {
    res.status(HTTP.OK).end()
}

export const readAllRecordables = async (req:Request, res:Response) => {
    let page = parseInt(<string>req.query.page) ?? 0;
    let per_page = parseInt(<string>req.query.per_page) ?? 10 as number;

    let result = await cypher(`
        MATCH (r:${getN4jNodeName(res.locals.type)})<-[:CREATED]-(:User {_id:$uid})
        WITH r,
            SIZE((r)<-[:REPOST_OF]-(:Post)) AS reposts,
            SIZE((r)<-[:REPLY_TO]-(:Post)) AS replies,
            SIZE((r)<-[:HEARTS]-(:User)) AS hearts,
        RETURN r, hearts, replies, reposts,
            EXISTS ((:User {_id:$selfid})-[:HEARTS]->(r)) AS isHearting,
            EXISTS ((:User {_id:$selfid})-[:POSTED]->(:Post)-[:REPOST_OF]->(r)) AS hasReposted
    `, {
        uid: req.params.uid,
        selfid: req.session.user.id
    })

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
                    // measurement_count: r.measurement_count.toNumber(),
                    state: getDeviceState(r),
                    thumbnail: r.thumbnail
                } as IDeviceStub
                break;
            case RecordableType.Plant:
            case RecordableType.Garden:
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

    let paginatedResults = {
        data: recordables,
        pagination: createPaginator(`${config.API_URL}/${res.locals.type}s`, page, per_page, recordables.length)
    }

    res.json(paginatedResults);
}

export const createPaginator = (base_url:string, page:number, per_page:number, total_elements:number):IPaginator => {
    let paginator:IPaginator = {
        first: base_url + `?page=1&per_page=${per_page}`,
        last: base_url + `?page=${Math.ceil(total_elements/per_page)}&per_page=${per_page}`,
        next: null,
        prev: null,
        total_results: total_elements
    }

    if ((page-1)*per_page > 0)          paginator.prev = base_url + `?page=${page-1}&per_page=${per_page}`
    if (page*per_page < total_elements) paginator.next = base_url + `?page=${page+1}&per_page=${per_page}`

    return paginator;
}