import { Request, Response, NextFunction } from "express";
import { NodeType } from "@cxss/interfaces";
import { HTTP } from "./common/http";
import { ErrorHandler } from "./common/errorHandler";
import { cypher } from "./common/dbs";
const AsyncRouter = require("express-async-router").AsyncRouter;

//Checks if an object is not null, throws exception if it is
export const getCheck = <T>(
  nameForErrorIfNull: string,
  itemToCheckExists: T | null | undefined
): T => {
  if (!itemToCheckExists) throw new Error(`${nameForErrorIfNull} not found`);
  else return itemToCheckExists;
};

export enum Access {
  SiteAdmin,
  OrgAdmin,
  OrgEditor,
  OrgMember,
  ItemOwner,
  Authenticated,
  None,
}

const skip = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export class McnRouter {
  router: any;

  constructor() {
    this.router = AsyncRouter();
  }

  get = <T>(
    path: string,
    controller: (req: Request, next: NextFunction, permissions: Access[]) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.OK).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.get(path, getCheckPermissions(access, nodeData), validators, wrappedController);
  };

  post = <T>(
    path: string,
    controller: (req: Request, next: NextFunction, permissions: Access[]) => Promise<T>,
    access: Access[],
    validators: any = skip
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.Created).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.post(path, getCheckPermissions(access), validators, wrappedController);
  };

  put = <T>(
    path: string,
    controller: (req: Request, next: NextFunction, permissions: Access[]) => Promise<T>,
    access: Access[],
    validators: any = skip
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.OK).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.put(path, getCheckPermissions(access), validators, wrappedController);
  };

  delete = <T>(
    path: string,
    controller: (req: Request, next: NextFunction, permissions: Access[]) => Promise<T>,
    access: Access[],
    validators: any = skip
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.Created).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.delete(path, getCheckPermissions(access), validators, wrappedController);
  };
}

const getCheckPermissions = (access: Access[], nodeData?: [NodeType, string]) => {
  //highest to lowest privilege check
  return async (req: Request, res: Response, next: NextFunction) => {
    //Site admin can do anything
    if (access.includes(Access.SiteAdmin)) {
      let result = await cypher(
        `
        MATCH (u:User {_id:$uid, admin:true})
        RETURN u
      `,
        {
          uid: req.session.user._id,
        }
      );
      if (!result.records.length) next(new ErrorHandler(HTTP.Unauthorised));
      return next();
    }

    //Check if user is owner of item
    if (nodeData && access.some((a) => [Access.ItemOwner].includes(a))) {
      let result = await cypher(
        `
        MATCH (u:User {_id:$uid})-[isOwner:CREATED | OWNER]->(n:${nodeData[0]} {_id:iid})
        RETURN isOwner, n
      `,
        {
          uid: req.session.user._id,
          iid: req.params[nodeData[1]],
        }
      );

      getCheck(result.records[0]?.get("n"), nodeData[0]);
      if (!result.records[0]?.get("isOwner"))
        return next(new ErrorHandler(HTTP.Unauthorised, "You do not own this item"));
      return next();
    }

    // Check if user must be part of organisation to perform action
    if (access.some((a) => [Access.OrgAdmin, Access.OrgEditor, Access.OrgMember].includes(a))) {
      let result = await cypher(
        `
        MATCH (u:User {_id:$uid})-[isOrgMember:IN]->(o:Organisation {_id:$oid})
        RETURN u, o, isOrgMember,
          EXISTS ((u)-[:OWNER]->(o)) as isOrgOwner,
          EXISTS ((u)-[:EDITOR]->(o)) as isOrgEditor
      `,
        {
          uid: req.session.user._id,
          oid: req.params.oid,
        }
      );

      //check org owner first
      if (
        access.some((a) => [Access.OrgAdmin].includes(a)) &&
        !result.records[0].get("isOrgOwner")
      ) {
        return next(
          new ErrorHandler(HTTP.Unauthorised, "Requires Org Owner privilege to perform action.")
        );
      } else {
        //then editor
        if (
          access.some((a) => [Access.OrgEditor].includes(a)) &&
          !result.records[0].get("isOrgEditor")
        ) {
          return next(
            new ErrorHandler(HTTP.Unauthorised, "Requires Org Editor privilege to perform action.")
          );
        } else {
          //finally member
          if (
            access.some((a) => [Access.OrgMember].includes(a)) &&
            !result.records[0].get("isOrgMember")
          ) {
            return next(
              new ErrorHandler(HTTP.Unauthorised, "You are not member of this organisation.")
            );
          } else {
            return next();
          }
        }
      }
    }

    //must be atleast logged in
    if (!req.session && access.includes(Access.Authenticated))
      throw new ErrorHandler(HTTP.Unauthorised, `Session required to access requested resource.`);

    // no perms / session required
    if (access.includes(Access.None)) return next();
  };
};
