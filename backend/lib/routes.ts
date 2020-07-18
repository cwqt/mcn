import { validate } from "./common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");
import { Request, Response } from "express";
import { NodeType } from "@cxss/interfaces";
import { Access } from "./router";

import Users = require("./controllers/Users/User.controller");

import { McnRouter } from "./router";

const mcnr = new McnRouter();

const getItems = (node: NodeType) => {
  return async (req: Request) => {
    return "cock";
  };
};

const sayHello = async (req: Request) => {
  return "Hello";
};

mcnr.post("/login", Users.loginUser, [Access.None],
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password length must be > 6 characters")
    ])
);

mcnr.get("/users", getItems(NodeType.User), [Access.SiteAdmin]);

mcnr.get("/roles", sayHello, [Access.SiteAdmin]);

export default mcnr;
