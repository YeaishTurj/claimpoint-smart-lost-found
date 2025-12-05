import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleAuthorization } from "../middlewares/roleAuth.middleware.js";
import { addStaff } from "../controllers/superadmin.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/resend-verification-code", resendVerificationCode);
router.post(
  "/add-staff",
  authenticateToken,
  roleAuthorization("SUPERADMIN"),
  addStaff
);

export default router;
