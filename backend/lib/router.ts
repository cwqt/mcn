import { Request, Response, NextFunction } from "express";
import { NodeType } from "@cxss/interfaces";
import { HTTP } from "./common/http";
import { ErrorHandler } from "./common/errorHandler";
import { cypher } from "./common/dbs";
import { accessSync } from "fs";
const AsyncRouter = require("express-async-router").AsyncRouter;

export enum Access {
  SiteAdmin,
  OrgAdmin,
  OrgEditor,
  OrgMember,
  ItemOwner,
  Ourself,
  InOrg,
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
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.Created).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.post(path, getCheckPermissions(access, nodeData), validators, wrappedController);
  };

  put = <T>(
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
    this.router.put(path, getCheckPermissions(access, nodeData), validators, wrappedController);
  };

  delete = <T>(
    path: string,
    controller: (req: Request, next: NextFunction, permissions: Access[]) => Promise<T>,
    access: Access[],
    validators: any = skip,
    nodeData?: [NodeType, string]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, next, access);
        res.status(HTTP.Created).json(item);
      } catch (err) {
        throw new ErrorHandler(HTTP.ServerError, err);
      }
    };
    this.router.delete(path, getCheckPermissions(access, nodeData), validators, wrappedController);
  };
}

const getCheckPermissions = (access: Access[], nodeData?: [NodeType, string]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //No perms / session required
      if (access.includes(Access.None)) return next();

      //All other checks require an active session (logged in)
      if (!req.session?.user) throw new Error(`Session required to access requested resource`);

      //Site admin can do anything
      if (req.session.user.admin) return next();

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

      //Check if node in same org as user & user has access >= editor
      if (nodeData && access.some((a) => [Access.InOrg].includes(a))) {
        //item must share common org with user and nodes
        let result = await cypher(
          `
          MATCH (u:User $uid)-[UserInOrg:IN]->(:Organisation)<-[NodeInOrg:IN]-(n:${nodeData[0]} {_id:$iid})
          WHERE UserInOrg.role IN $roles
          RETURN UserInOrg, NodeInOrg
        `,
          {
            uid: req.session.user._id,
            iid: req.params[nodeData[1]],
            roles: [Access.OrgEditor, Access.SiteAdmin],
          }
        );

        if (!result.records[0]?.get("UserInOrg"))
          throw new Error("Do not have permission for this action.");
        if (!result.records[0]?.get("NodeInOrg"))
          throw new Error(`${nodeData[0]} is not in this organisation`);
        return next();
      }

      // Check if user must be part of organisation to perform action
      if (access.some((a) => [Access.OrgAdmin, Access.OrgEditor, Access.OrgMember].includes(a))) {
        let result = await cypher(
          `
          MATCH (u:User {_id:$uid})-[orgRole:IN]->(o:Organisation {_id:$oid})
          RETURN u, o, orgRole, ${
            nodeData
              ? `EXISTS ((u)-[:IN]->(o)<-[:IN]-(n:${nodeData[0]} {_id:$iid})) as nodeInOrg`
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

        let requiredAccess: Access;
        if (nodeData) {
          if (!result.records[0]?.get("nodeInOrg"))
            throw new Error(`User and ${nodeData[0]} share no common organisation`);

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
        }

        return next();
      }
    } catch (error) {
      next(new ErrorHandler(HTTP.Unauthorised, error));
    }
  };
};
