import { validate } from "../common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");
import { Request, Response } from "express";
import { createOrg, readOrgNodes, addItemToOrg } from "../controllers/Orgs.controller";
import { OrgItemType, NodeType, OrgRole } from "../models/Node.model";

const router = AsyncRouter({ mergeParams: true });
router.post("/", validate([body("name").not().isEmpty().trim()]), createOrg);

// ORG ============================================================================================
const orgRouter = AsyncRouter({ mergeParams: true });
router.use("/:org_id", orgRouter);

// ORG ITEMS ======================================================================================
const orgItemsRouter = AsyncRouter({ mergeParams: true });
orgRouter.use("/items", orgItemsRouter);
orgItemsRouter.use(validate([query("type").isIn(Object.values(OrgItemType))]));

orgItemsRouter.get("/", readOrgNodes);

// ORG ITEM =======================================================================================
const orgItemRouter = AsyncRouter({ mergeParams: true });
orgItemsRouter.use("/:iid", orgItemRouter);

orgItemRouter.post(
  "/",
  (req: Request, res: Response) => {
    switch (req.params.type) {
      case NodeType.User:
        res.locals.relationshipBody = { role: OrgRole.Viewer };
    }
  },
  addItemToOrg
);

export default router;
