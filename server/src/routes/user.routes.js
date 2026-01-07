import express from "express";

import {
  reportLostItem,
  getMyReports,
  updateMyReport,
  deleteMyReport,
  myClaimSubmit,
  getMyClaims,
  getMyClaimDetails,
  deleteMyClaim,
  getMyReportDetails,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/lost-reports", reportLostItem);

router.get("/lost-reports", getMyReports);

router.get("/lost-reports/:id", getMyReportDetails);

router.patch("/lost-reports/:id", updateMyReport);

router.delete("/lost-reports/:id", deleteMyReport);

router.post("/claims/:id", myClaimSubmit);

router.get("/claims", getMyClaims);

router.get("/claims/:id", getMyClaimDetails);

router.delete("/claims/:id", deleteMyClaim);

export default router;
