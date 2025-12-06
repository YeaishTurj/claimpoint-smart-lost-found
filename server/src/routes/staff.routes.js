import express from "express";
import { addFoundItem } from "../controllers/staff.controller.js";

const router = express.Router();

// Route: Add a found item
router.post("/add-found-item", addFoundItem);

export default router;
