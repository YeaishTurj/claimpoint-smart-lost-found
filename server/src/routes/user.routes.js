import express from "express";

import {
  reportLostItem,
  getUserLostReports,
  updateUserLostReport,
  deleteUserLostReport,
  userClaimItem,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route: Report a lost item
router.post("/report-lost-item", reportLostItem);

router.get("/lost-reports", getUserLostReports);

router.patch("/lost-reports/:id", updateUserLostReport);

router.delete("/lost-reports/:id", deleteUserLostReport);

router.post("/claim-item/:id", userClaimItem);

export default router;
