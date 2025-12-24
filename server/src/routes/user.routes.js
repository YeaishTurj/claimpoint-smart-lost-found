import express from "express";

import {
  ReportLostItem,
  GetUserLostReports,
  UpdateUserLostReport
} from "../controllers/user.controller.js";

const router = express.Router();

// Route: Report a lost item
router.post("/report-lost-item", ReportLostItem);

router.get("/lost-reports", GetUserLostReports);

router.patch("/lost-reports/:id", UpdateUserLostReport);

export default router;
