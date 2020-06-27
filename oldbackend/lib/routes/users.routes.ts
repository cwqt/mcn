import { validate } from "../common/validate";
const AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param, query } = require("express-validator");
const multer = require("multer");

import {
  readAllUsers,
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
} from "../controllers/User.controller";

import posts from "./posts.routes";
import devices from "./iot/devices.routes";
import plants from "./farms/plants.routes";

const storage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, //no files larger than 2mb
  },
});

const router = AsyncRouter({ mergeParams: true });

router.get("/", readAllUsers);

router.post(
  "/",
  validate([
    body("username")
      .not()
      .isEmpty()
      .trim()
      .withMessage("username cannot be empty"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("password length must be > 6 characters"),
  ]),
  createUser
);

router.post(
  "/login",
  validate([
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("not a valid email address"),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("password length must be > 6 characters"),
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
userRouter.use(
  validate([param("uid").isMongoId().trim().withMessage("invalid user id")])
);

userRouter.put("/avatar", storage.single("avatar"), updateUserAvatar);
userRouter.put(
  "/cover_image",
  storage.single("cover_image"),
  updateUserCoverImage
);

userRouter.get("/", readUserById);
userRouter.get("/orgs", readUserOrgs);
userRouter.put("/", updateUser);
userRouter.delete("/", deleteUser);

userRouter.use("/posts", posts);
userRouter.use("/devices", devices);

export default router;
