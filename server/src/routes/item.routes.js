import express from "express";

import {
  getAllFoundItems,
  getFoundItemById,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/found-items", getAllFoundItems);
router.get("/found-items/:id", getFoundItemById);

export default router;
