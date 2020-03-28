import { Response } from 'express';

interface ErrorResponse {
    [key: string]: any
}

export const handleError = (err:ErrorHandler, res:Response) => {
    const { statusCode, message } = err;
    let response:ErrorResponse = { status: 'error', statusCode }
    if(message) response['message'] = message;
    res.status(statusCode).json(response);
    return;
};

export class ErrorHandler extends Error {
    statusCode: number;

    constructor(statusCode:number, message?:any) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
