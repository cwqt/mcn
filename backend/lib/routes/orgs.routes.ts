import { validate } from "../common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");

const router = AsyncRouter({ mergeParams: true });

import { createOrg, readOrgDevices, readOrgUsers } from "../controllers/Orgs.controller";
// import { addItemToOrg } from "../controllers/Recordables/Recordable.controller";

router.post("/", validate([body("name").not().isEmpty().trim()]), createOrg);

// ORG ============================================================================================
const orgRouter = AsyncRouter({ mergeParams: true });
router.use("/:org_id", orgRouter);

// orgRouter.get("/recordables", readOrgRecordables);
orgRouter.get("/users", readOrgUsers);

const orgItemsRouter = AsyncRouter({ mergeParams: true });
// orgRouter.use("/items", orgItemsRouter);
// orgItemsRouter.use(validate([query("type").isIn(Object.values(OrgItemType))]));

// // orgRouter.get("/", readItems(true));

// const orgItemRouter = AsyncRouter({ mergeParams: true });
// orgItemsRouter.use("/:iid", orgItemsRouter);

// orgItemRouter.post("/", addItemToOrg);
// orgItemRouter.get();

// router.get('/alerts', getOrgAlerts);
// router.get('/farms', getOrgFarms);
// router.get('/racks', getOrgRacks);
// router.get('/crops', getOrgCrops);

export default router;
