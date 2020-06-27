import { Request, Response } from "express";
import { validate } from "../../common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param } = require("express-validator");
const multer = require("multer");

import {
  readUserById,
  readUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserCoverImage,
  readUserOrgs,
} from "../../controllers/Users/User.controller";

// import posts from "./posts.routes";
// import devices from "../iot/devices.routes";
// import plants from "../Hydroponics/plants.routes";

import { Node } from "../../models/Node.model";
import {
  createNode,
  readNodes,
  updateNode,
  readNodeMiddleware,
  deleteNodeMiddleware,
} from "../../controllers/Node.controller";
import { filterUserFields } from "../../controllers/Users/User.controller";

const storage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, //no files larger than 2mb
  },
});

const router = AsyncRouter({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
  res.json(filterUserFields(await readNodes(Node.User)));
});

router.post(
  "/",
  validate([
    body("username").not().isEmpty().trim().withMessage("Username cannot be empty"),
    body("email").isEmail().normalizeEmail().withMessage("Not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password length must be > 6 characters"),
  ]),
  createUser
);

router.post(
  "/login",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password length must be > 6 characters"),
  ]),
  loginUser
);

router.get(
  "/u/:username",
  validate([param("username").not().isEmpty().trim()]),
  readUserByUsername
);

// uses req.session.user
router.post("/logout", logoutUser);

// USER ===========================================================================================
const userRouter = AsyncRouter({ mergeParams: true });
router.use("/:uid", userRouter);
userRouter.use(validate([param("uid").isMongoId().trim().withMessage("Invalid user ID")]));

userRouter.get("/", readNodeMiddleware(Node.User, "uid"));
userRouter.get("/orgs", readUserOrgs);

userRouter.put("/avatar", storage.single("avatar"), updateUserAvatar);
userRouter.put("/cover_image", storage.single("cover_image"), updateUserCoverImage);
userRouter.put("/", async (req: Request, res: Response) => {
  let user = await updateNode(Node.User, req.params.uid, req.body);
  res.json(user);
});

userRouter.delete("/", deleteNodeMiddleware(Node.User, "uid"));

export default router;
