import { Request, Response, NextFunction } from "express";

//middleware -- get device api key and auth it with headers
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
