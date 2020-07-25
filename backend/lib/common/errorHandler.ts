import { Request, Response, NextFunction } from "express";
import log from "./logger";
import { HTTP } from "./http";

export const handleError = (
  req: Request,
  res: Response,
  next: NextFunction,
  err: ErrorHandler | Error
) => {
  let ErrorType: HTTP;
  let message: string = err.message;

  if (err instanceof ErrorHandler) {
    ErrorType = err.ErrorType;
  } else {
    ErrorType = HTTP.ServerError;
  }

  let response = {
    status: `${ErrorType}`.startsWith("4") ? "fail" : "error",
    statusCode: ErrorType || 520,
    message: message,
  };

  log.error(
    `--> ${err.name}: ${
      typeof err.message == "object" ? JSON.stringify(err.message) : err.message
    } (${ErrorType})`
  );

  res.status(response.statusCode).json(response);
  next(err);
};

export class ErrorHandler extends Error {
  ErrorType: HTTP;

  constructor(statusCode: HTTP, ...params: any[]) {
    super(...params);
  }
}

export interface IFormErrorField {
  param: string;
  msg: string;
  value: any;
}

export class FormErrorResponse {
  errors: IFormErrorField[];
  constructor() {
    this.errors = [];
  }
  push(param: string, message: string, value: any) {
    this.errors.push({ param: param, msg: message, value: value });
  }
  get value() {
    return this.errors;
  }
}
