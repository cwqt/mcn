import { Request, Response, NextFunction }    from "express"

import { Garden, IGardenModel }       from '../models/Garden.model';
import { Plant, IPlantModel }         from '../models/Plant.model';
import { ErrorHandler }             from "../common/errorHandler";
import { HTTP }                     from "../common/http";

export const createGarden = (req:Request, res:Response, next:NextFunction) => {
    Garden.create(req.body, (error:any, garden:IGardenModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(garden);
    })
}

export const updateGarden = (req:Request, res:Response, next:NextFunction) => {
    Garden.findByIdAndUpdate(req.params.rid, res.locals.newData, (error:any, garden:IGardenModel) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        res.json(garden);
    })
}


export const readGardenPlants = (req:Request, res:Response, next:NextFunction) => {
    Plant.find({"in_garden": req.params.rid}, (error:any, plants:IPlantModel[]) => {
        if(error) return next(new ErrorHandler(HTTP.ServerError, error));
        return res.json(plants)
    })
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