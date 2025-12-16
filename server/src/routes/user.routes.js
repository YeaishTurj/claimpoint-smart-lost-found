import express from "express";

import {
  ReportLostItem,
  GetUserLostReports,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route: Report a lost item
router.post("/report-lost-item", ReportLostItem);

router.get("/lost-reports", GetUserLostReports);

export default router;
