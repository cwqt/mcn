import { Request, Response, }    from "express"

import { IGarden }      from '../../models/Garden.model';
import { IPlant }       from '../../models/Plant.model';
import { ErrorHandler } from "../../common/errorHandler";
import { HTTP }         from "../../common/http";

export const createGarden = (req:Request, res:Response) => {
    // Garden.create(req.body, (error:any, garden:IGardenModel) => {
    //     if(error) return next(new ErrorHandler(HTTP.ServerError, error));
    //     res.json(garden);
    // })
}

export const updateGarden = (req:Request, res:Response) => {
    // Garden.findByIdAndUpdate(req.params.rid, res.locals.newData, (error:any, garden:IGardenModel) => {
    //     if(error) return next(new ErrorHandler(HTTP.ServerError, error));
    //     res.json(garden);
    // })
}

export const getAvgPlantMeasurements = (req:Request, res:Response) => {
    //types: measurement type
    //timeframe: date range in days
}

export const readEvents = (req:Request, res:Response) => {
    //types: event type
    //page: pagination page
    //page_size: results / page
}