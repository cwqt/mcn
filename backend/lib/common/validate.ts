const { validationResult }      = require('express-validator');
import { ErrorHandler } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

export const validate = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ErrorHandler(422, errors.array());
    }

    next();
}