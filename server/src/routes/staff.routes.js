import express from "express";
import {
  addFoundItem,
  updateFoundItem,
  deleteFoundItem,
  getAllClaims,
  updateClaimStatus,
  getAllReports,
  getReportDetails,
  getClaimDetails,
  getAllMatches,
  approveMatch,
  rejectMatch,
  markItemCollected,
} from "../controllers/staff.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route: Add a found item (requires authentication)
router.post("/found-items", authenticateToken, addFoundItem);
router.patch("/found-items/:itemId", authenticateToken, updateFoundItem);
router.delete("/found-items/:itemId", authenticateToken, deleteFoundItem);

// Claims management
router.get("/claims", authenticateToken, getAllClaims);
router.get("/claims/:claimId", authenticateToken, getClaimDetails);
router.patch("/claims/:claimId", authenticateToken, updateClaimStatus);

// Lost reports
router.get("/lost-reports", authenticateToken, getAllReports);
router.get("/lost-reports/:reportId", authenticateToken, getReportDetails);

// Item matches (auto-matched lost reports with found items)
router.get("/matches", authenticateToken, getAllMatches);
router.patch("/matches/:matchId/approve", authenticateToken, approveMatch);
router.patch("/matches/:matchId/reject", authenticateToken, rejectMatch);
router.patch(
  "/matches/:matchId/collected",
  authenticateToken,
  markItemCollected
);

export default router;
