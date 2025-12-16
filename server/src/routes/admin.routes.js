import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleAuthorization } from "../middlewares/roleAuth.middleware.js";
import {
  addStaff,
  getAllUsers,
  deactivateUser,
  activateUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post(
  "/add-staff",
  authenticateToken,
  roleAuthorization("ADMIN"),
  addStaff
);

router.get(
  "/get-all-users",
  authenticateToken,
  roleAuthorization("ADMIN"),
  getAllUsers
);

router.patch(
  "/deactivate-user/:userId",
  authenticateToken,
  roleAuthorization("ADMIN"),
  deactivateUser
);

router.patch(
  "/activate-user/:userId",
  authenticateToken,
  roleAuthorization("ADMIN"),
  activateUser
);

export default router;
