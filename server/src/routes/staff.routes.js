import express from "express";
import { addFoundItem } from "../controllers/staff.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route: Add a found item (requires authentication)
router.post("/add-found-item", authenticateToken, addFoundItem);

export default router;
