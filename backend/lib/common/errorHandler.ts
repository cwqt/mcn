import { Response } from 'express';
import log          from './logger';
import { HTTP } from './http';

interface ErrorResponse {
    [key: string]: any
}

export const handleError = (err:ErrorHandler, res:Response) => {
    const { statusCode, message } = err;
    log.error(`--> ${err.name}: ${typeof(err.message) == 'object' ? JSON.stringify(err.message) : err.message} (${err.statusCode})`)
    let response:ErrorResponse = {
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        statusCode: statusCode || 520,
    }

    console.log(err.stack)
    
    if(message) response['message'] = message;
    return res.status(response.statusCode).json(response);
};

class IError extends Error {
    statusCode:HTTP;
    isOperational:boolean;
    constructor(message?:string) {
        super(message || '')
    }
}

export class ErrorHandler extends IError {
    constructor(statusCode:HTTP, message?:any) {
        super(message);
        this.statusCode = statusCode || HTTP.ServerError;
        this.message = message;

        IError.captureStackTrace(this, this.constructor)
    }
}
