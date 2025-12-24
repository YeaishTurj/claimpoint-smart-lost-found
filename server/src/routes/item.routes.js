import express from "express";

import {
  getAllFoundItems,
  getFoundItemById,
  getLostReportById
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/found-items", getAllFoundItems);
router.get("/found-items/:id", getFoundItemById);
router.get("/lost-reports/:id", getLostReportById);

export default router;
