import { Router, Request, Response, NextFunction } from "express";
import { IUser } from "@cxss/interfaces";
import multer = require("multer");
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
  router: Router;

  constructor() {
    this.router = AsyncRouter();
  }

  get = <T>(
    path: string,
    validators: any = skip,
    controller: (req: Request, permissions: Access[]) => Promise<T>,
    access: Access[]
  ) => {
    const wrappedController = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await controller(req, access);
        res.status(HTTP.OK).json(item);
      } catch (err) {
        // handleError(req, res, next, err);
      }
    };
    this.router.get(path, getCheckPermissions(access), validators, wrappedController);
  };

  //   regCreate = <T>(
  //     path: string,
  //     controller: (
  //       req: UserRequest,
  //       spacePermissions: IUserPermissions | undefined,
  //       connection: mongoose.Connection | undefined
  //     ) => Promise<T>,
  //     access: DbAccess,
  //     options?: DbRouterOptions
  //   ) => {
  //     const fixedOptions = this.resolveOptions(options);
  //     const wrappedController = async (req: UserRequest, res: Response, next: NextFunction) => {
  //       try {
  //         this.logRequest(path, req);
  //         const userSpacePermissions = await getCheckPermissions(
  //           access,
  //           req,
  //           fixedOptions.spaceParam
  //         );
  //         const item = await controller(req, userSpacePermissions, fixedOptions.mongooseConnection);
  //         res.status(200).json(item);
  //       } catch (err) {
  //         handleError(req, res, next, err);
  //       }
  //     };
  //     this.router.post(path, fixedOptions.auth, wrappedController);
  //   };
  //   regUpdate = <T>(
  //     path: string,
  //     controller: (
  //       req: UserRequest,
  //       spacePermissions: IUserPermissions | undefined,
  //       connection: mongoose.Connection | undefined
  //     ) => Promise<T>,
  //     access: DbAccess,
  //     options?: DbRouterOptions
  //   ) => {
  //     const fixedOptions = this.resolveOptions(options);
  //     const wrappedController = async (req: UserRequest, res: Response, next: NextFunction) => {
  //       try {
  //         this.logRequest(path, req);
  //         const userSpacePermissions = await getCheckPermissions(
  //           access,
  //           req,
  //           fixedOptions.spaceParam
  //         );
  //         const item = await controller(req, userSpacePermissions, fixedOptions.mongooseConnection);
  //         res.status(200).json(item);
  //       } catch (err) {
  //         handleError(req, res, next, err);
  //       }
  //     };
  //     this.router.put(path, fixedOptions.auth, fileParser.single("asset"), wrappedController);
  //   };
  //   regDelete = (
  //     path: string,
  //     controller: (
  //       req: UserRequest,
  //       spacePermissions: IUserPermissions | undefined,
  //       connection: mongoose.Connection | undefined
  //     ) => Promise<boolean>,
  //     access: DbAccess,
  //     options?: DbRouterOptions
  //   ) => {
  //     const fixedOptions = this.resolveOptions(options);
  //     const wrappedController = async (req: UserRequest, res: Response, next: NextFunction) => {
  //       try {
  //         this.logRequest(path, req);
  //         const userSpacePermissions = await getCheckPermissions(
  //           access,
  //           req,
  //           fixedOptions.spaceParam
  //         );
  //         const deleted = await controller(
  //           req,
  //           userSpacePermissions,
  //           fixedOptions.mongooseConnection
  //         );
  //         res.status(200).json(deleted);
  //       } catch (err) {
  //         // handleError(req, res, next, err);
  //       }
  //     };
  //     this.router.delete(path, fixedOptions.auth, wrappedController);
  //   };
}

// const handleError = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   err: DbError | Error
// ) => {
//   await logger.error(`Error occurred in backend`, { error: err });
//   if (err["errorType"] != undefined) {
//     switch (err["errorType"]) {
//       case DbErrorType.Unauthorised:
//         res.status(401).send(`Unauthorised: You are not authorised to view this content`);
//         break;
//       case DbErrorType.NotFound:
//         res.status(404).send(`Content not found`);
//         break;
//       case DbErrorType.BadRequest:
//         res.status(400).send(`Bad Request`);
//         break;
//     }
//   } else {
//     res.status(400).send(`Bad Request`);
//   }
//   next(err);
// };
const getCheckPermissions = async (
  access: Access[],
  req: Request,
  next: NextFunction
): Promise<void> => {
  if (access.includes(Access.None)) return;
  if (!req.session) throw new ErrorHandler(HTTP.Unauthorised, `Session required to access`);

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
    if (!result.records.length) throw new ErrorHandler(HTTP.Unauthorised);
    return;
  }

  let requiresOrgAccess = access.some((a) =>
    [Access.OrgAdmin, Access.OrgEditor, Access.OrgMember].includes(a)
  );
  if (requiresOrgAccess) {
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

    if(!result.records[0].get('isOrgMember')) throw new ErrorHandler(HTTP.Unauthorised);
    if(access.find(a => Access.OrgAdmin) && !)
  }

  let requiresItemOwnership = access.some((a) => [Access.ItemOwner].includes(a));

  // if(requiresOrgAccess)

  // if (access == Access.None) return;

  // if (access != Access.None) {
  //   if (!req.user) {
  //     throw new DbError(DbErrorType.Unauthorised, "auth required, had none");
  //   } else if (access == DbAccess.Authenticated) {
  //     // do nothing - they are authed
  //   } else if (access == DbAccess.EnvOwner) {
  //     if (!req.user.environmentAdmin || !req.user.environmentOwner) {
  //       throw new DbError(DbErrorType.Unauthorised, "env owner admin required, had none");
  //     }
  //   } else if (access == DbAccess.EnvAdmin) {
  //     // check the user has auth admin
  //     if (!req.user.environmentAdmin) {
  //       throw new DbError(DbErrorType.Unauthorised, "env admin required, had none");
  //     }
  //   } else {
  //     // we have a space access
  //     // check we have a spaceId to find
  //     if (!spaceParam || !req.params[spaceParam]) {
  //       throw new DbError(
  //         DbErrorType.BadRequest,
  //         "no valid space param given for method with space-based accessibility"
  //       );
  //     }
  //     // get the space from the DB
  //     const spaceId = req.params[spaceParam];
  //     const space = await DocumentSpace.findById(spaceId).lean();
  //     if (!space) {
  //       throw new DbError(
  //         DbErrorType.BadRequest,
  //         "no valid space param given for method with space-based accessibility"
  //       );
  //     }
  //     for (let i = 0; i < space.userPermissions.length && !userSpacePermissions; i++) {
  //       let up = space.userPermissions[i];
  //       if (up.user.equals(req.user._id)) {
  //         userSpacePermissions = up;
  //       }
  //     }

  //     //envAdmin has same rights as spaceAdmin
  //     if (!userSpacePermissions && req.user.environmentAdmin) {
  //       userSpacePermissions = {
  //         user: req.user,
  //         hasAccess: true,
  //         hasAdmin: true,
  //         status: "",
  //         isOwner: false,
  //         documentManager: false,
  //         documentManagerElevated: false,
  //       };
  //     } else if (userSpacePermissions && req.user.environmentAdmin) {
  //       userSpacePermissions.hasAccess = true;
  //       userSpacePermissions.hasAdmin = true;
  //     }

  //     if (
  //       !userSpacePermissions ||
  //       !userSpacePermissions.hasAccess ||
  //       (access == DbAccess.SpaceDocMan && !userSpacePermissions.documentManager) ||
  //       (access == DbAccess.SpaceDocManElevated && !userSpacePermissions.documentManagerElevated) ||
  //       (access == DbAccess.SpaceAdmin && !userSpacePermissions.hasAdmin) ||
  //       (access == DbAccess.SpaceOwner && !userSpacePermissions.isOwner)
  //     ) {
  //       throw new DbError(DbErrorType.Unauthorised, `${access} required, had none`);
  //     }
  //   }
  // }
  // return userSpacePermissions;
};
