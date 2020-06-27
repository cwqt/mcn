import { validate } from "../common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");

const router = AsyncRouter({ mergeParams: true });

import { createOrg } from "../controllers/Orgs.controller";

router.post("/", validate([body("name").not().isEmpty().trim()]), createOrg);

export default router;
