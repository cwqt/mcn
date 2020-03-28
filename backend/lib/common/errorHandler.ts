import { Response } from 'express';

interface ErrorResponse {
    [key: string]: any
}

export const handleError = (err:ErrorHandler, res:Response) => {
    const { statusCode, message } = err;
    let response:ErrorResponse = {
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        statusCode,
    }

    console.log('@@@@@' , err.name)

    if(message) response['message'] = message;
    if(err.isOperational) {
        response['stack'] = err.stack
    }

    res.status(statusCode).json(response);
    return;
};

class IError extends Error {
    statusCode:number;
    isOperational:boolean;
    constructor(message?:string) {
        super(message || '')
    }
}

export class ErrorHandler extends IError {
    constructor(statusCode:number, message?:any) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = true;

        IError.captureStackTrace(this, this.constructor)
    }
}
