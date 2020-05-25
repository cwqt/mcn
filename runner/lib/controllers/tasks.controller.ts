import { Response, Request } from "express";


export const markTaskComplete = (req:Request, res:Response) => {
    let taskState = res.locals.state;

}