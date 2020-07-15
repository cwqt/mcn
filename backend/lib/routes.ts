import { validate } from "./common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");
import { Request, Response } from "express";
import { NodeType } from "@cxss/interfaces";
import { Access } from "./router";

import { McnRouter } from "./router";

const mcnr = new McnRouter();

const getItems = (node: NodeType) => {
  return async (req: Request) => {
    return "cock";
  };
};

mcnr.get("/users", null, getItems(NodeType.User), [Access.SiteAdmin]);

// USERS

export default mcnr;
