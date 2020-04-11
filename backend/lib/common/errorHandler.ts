import { Response } from 'express';

interface ErrorResponse {
    [key: string]: any
}

export const handleError = (err:ErrorHandler, res:Response) => {
    console.log('@@@@@' , err.name)
    const { statusCode, message } = err;
    let response:ErrorResponse = {
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        statusCode: statusCode || 520,
    }

    if(message) response['message'] = message;
    if(process.env.NODE_ENV == 'development') response['stack'] = err.stack

    return res.status(response.statusCode).json(response);
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
        this.statusCode = statusCode || 500;
        this.message = message;

        IError.captureStackTrace(this, this.constructor)
    }
}
