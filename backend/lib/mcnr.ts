import { Request, Response, NextFunction } from "express";
import { NodeType } from "@cxss/interfaces";
import { HTTP } from "./common/http";
import { ErrorHandler, handleError } from "./common/errorHandler";
import { cypher } from "./common/dbs";
import { accessSync } from "fs";
import { resolveSoa } from "dns";
import logger from "./common/logger";
const AsyncRouter = require("express-async-router").AsyncRouter;

export enum Access {
  SiteAdmin,
  OrgAdmin,
  OrgEditor,
  OrgMember,
  Ourself,
  Authenticated,
  None,
}

export interface IResLocals {
  session?: {
    user?: {
      _id: string;
      admin: boolean;
    };
  };
  pagination?: {
    per_page: number;
    page: number;
  };
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
    controller: (
      req: Request,
      next: NextFunction,
      locals: IResLocals,
      permissions: Access[]
    ) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(
          req,
          next,
          {
            session: req.session,
            pagination: {
              per_page: res.locals.per_page,
              page: res.locals.page,
            },
          } as IResLocals,
          access
        );
        res.status(HTTP.OK).json(item);
      } catch (err) {
        handleError(req, res, next, err);
      }
    };
    this.router.get(
      path,
      getCheckPermissions(access, nodeData),
      validators ?? skip,
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.page = parseInt(req.query.page as string) || 0;
        res.locals.per_page = parseInt(req.query.per_page as string) || 10;
        next();
      },
      wrappedController
    );
  };

  post = <T>(
    path: string,
    controller: (
      req: Request,
      next: NextFunction,
      locals: IResLocals,
      permissions: Access[]
    ) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(
          req,
          next,
          {
            session: req.session,
          } as IResLocals,
          access
        );
        res.status(HTTP.Created).json(item);
      } catch (err) {
        handleError(req, res, next, err);
      }
    };
    this.router.post(
      path,
      getCheckPermissions(access, nodeData),
      validators ?? skip,
      wrappedController
    );
  };

  put = <T>(
    path: string,
    controller: (
      req: Request,
      next: NextFunction,
      locals: IResLocals,
      permissions: Access[]
    ) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(
          req,
          next,
          {
            session: req.session,
          } as IResLocals,
          access
        );
        res.status(HTTP.OK).json(item);
      } catch (err) {
        handleError(req, res, next, err);
      }
    };
    this.router.put(
      path,
      getCheckPermissions(access, nodeData),
      validators ?? skip,
      wrappedController
    );
  };

  delete = <T>(
    path: string,
    controller: (
      req: Request,
      next: NextFunction,
      locals: IResLocals,
      permissions: Access[]
    ) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(
          req,
          next,
          {
            session: req.session,
          } as IResLocals,
          access
        );
        res.status(HTTP.Created).json(item);
      } catch (err) {
        handleError(req, res, next, err);
      }
    };
    this.router.delete(
      path,
      getCheckPermissions(access, nodeData),
      validators ?? skip,
      wrappedController
    );
  };

  redirect = <T>(
    path: string,
    controller: (
      req: Request,
      next: NextFunction,
      locals: IResLocals,
      permissions: Access[]
    ) => Promise<string>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const redirectUrl = await controller(
          req,
          next,
          {
            session: req.session,
          } as IResLocals,
          access
        );
        res.status(HTTP.Moved).redirect(redirectUrl);
      } catch (err) {
        handleError(req, res, next, err);
      }
    };
    this.router.get(
      path,
      getCheckPermissions(access, nodeData),
      validators ?? skip,
      wrappedController
    );
  };
}

const getCheckPermissions = (access: Access[], nodeData?: [NodeType, string]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //No perms / session required
      if (access.length == 0 || access.includes(Access.None)) return next();

      //All other checks require an active session (logged in)
      if (!req.session?.user) throw new Error(`Session required to access requested resource`);

      //Site admin can do anything
      if (req.session.user.admin) return next();
      if (access.some((a) => [Access.SiteAdmin].includes(a)) && !req.session.user.admin)
        throw new Error("Not site admin");

      // Only requires the user be logged in
      if (access.some((a) => [Access.Authenticated].includes(a))) return next();

      //Can only operate when is ourself
      if (access.some((a) => [Access.Ourself].includes(a)) && nodeData[0] == NodeType.User) {
        if (req.session.user._id !== req.params[nodeData[1]]) {
          throw new Error("User id & session id mismatch");
        }
      }

      //Check if user is owner of item
      if (nodeData) {
        let result = await cypher(
          `
          MATCH (u:User {_id:$uid})-[isOwner:CREATED]->(n:${nodeData[0]} {_id:iid})
          RETURN isOwner, n
        `,
          {
            uid: req.session.user._id,
            iid: req.params[nodeData[1]],
          }
        );

        if (!result.records[0]?.get("isOwner")) throw new Error("You do not own this item");
        return next();
      }

      // Check if user must be part of organisation to perform action
      if (access.some((a) => [Access.OrgAdmin, Access.OrgEditor, Access.OrgMember].includes(a))) {
        let result = await cypher(
          `
          MATCH (u:User {_id:$uid})-[orgRole:IN]->(o:Organisation {_id:$oid})
          RETURN u, o, orgRole${
            nodeData
              ? `, EXISTS ((u)-[:IN]->(o)<-[:IN]-(n:${nodeData[0]} {_id:$iid})) as nodeInOrg`
              : ""
          }
        `,
          {
            uid: req.session.user._id,
            oid: req.params.oid,
            iid: nodeData ? nodeData[1] : null,
          }
        );

        let userRole = result.records[0]?.get("orgRole")?.properties;

        // Allow anyone to view public organisations
        if (result.records[0].get("o").public) userRole.role = Access.OrgMember;
        if (!userRole) throw new Error("You are not in this organisation");

        const hasRole = (accessPolicy: Access) => {
          if (access.some((a) => [accessPolicy].includes(a)) && userRole.role == access)
            return true;
          return false;
        };

        if (nodeData) {
          if (!result.records[0]?.get("nodeInOrg"))
            throw new Error(`User and ${nodeData[0]} share no common organisation`);
        }

        let requiredAccess: Access;
        if (hasRole(Access.OrgAdmin)) {
          requiredAccess = Access.OrgAdmin;
        } else if (hasRole(Access.OrgEditor)) {
          requiredAccess = Access.OrgEditor;
        } else if (hasRole(Access.OrgMember)) {
          requiredAccess = Access.OrgMember;
        }

        if (userRole.role > requiredAccess)
          throw new Error(
            `Insufficient priviledge, needed ${requiredAccess}, got ${userRole.role}`
          );

        return next();
      }

      logger.error("Auth dead end.");
    } catch (error) {
      return next(new ErrorHandler(HTTP.Unauthorised, error.message));
    }
  };
};
