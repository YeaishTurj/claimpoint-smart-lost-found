import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleAuthorization } from "../middlewares/roleAuth.middleware.js";
import { addStaff } from "../controllers/admin.controller.js";

const router = express.Router();

router.post(
  "/add-staff",
  authenticateToken,
  roleAuthorization("ADMIN"),
  addStaff
);

export default router;
