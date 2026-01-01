import express from "express";
import {
  addFoundItem,
  updateFoundItem,
  deleteFoundItem,
  getAllClaims,
  updateClaimStatus,
  getAllReports,
  getReportDetails,
} from "../controllers/staff.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route: Add a found item (requires authentication)
router.post("/found-items", authenticateToken, addFoundItem);
router.patch("/found-items/:itemId", authenticateToken, updateFoundItem);
router.delete("/found-items/:itemId", authenticateToken, deleteFoundItem);
router.get("/claims", authenticateToken, getAllClaims);
router.patch("/claims/:claimId", authenticateToken, updateClaimStatus);
router.get("/lost-reports", authenticateToken, getAllReports);
router.get("/lost-reports/:reportId", authenticateToken, getReportDetails);

export default router;
