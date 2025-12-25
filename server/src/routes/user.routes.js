import express from "express";

import {
  reportLostItem,
  getUserLostReports,
  getUserLostReportDetails,
  updateUserLostReport,
  deleteUserLostReport,
  userClaimItem,
  getAllClaimsByUser,
  getUserClaimDetails,
  deleteUserClaim,
  updateUserClaim,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route: Report a lost item
router.post("/report-lost-item", reportLostItem);

router.get("/lost-reports", getUserLostReports);

router.get("/lost-reports/:id", getUserLostReportDetails);

router.patch("/lost-reports/:id", updateUserLostReport);

router.delete("/lost-reports/:id", deleteUserLostReport);

router.post("/claim-item/:id", userClaimItem);

router.get("/claims", getAllClaimsByUser);

router.get("/claims/:id", getUserClaimDetails);

router.delete("/claims/:id", deleteUserClaim);

router.patch("/claims/:id", updateUserClaim);

export default router;
