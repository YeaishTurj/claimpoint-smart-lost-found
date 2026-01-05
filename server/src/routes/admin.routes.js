import express from "express";
import {
  addStaff,
  updateStaff,
  getAllUsers,
  getAllStaffs,
  deactivateUser,
  activateUser,
  getStaffById,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Staff Management
router.post("/staffs", addStaff);
router.patch("/staffs/:staffId", updateStaff);
router.get("/staffs", getAllStaffs);
router.get("/staffs/:staffId", getStaffById);

// User Management
router.get("/users", getAllUsers);

// User Status Management
router.patch("/users/:userId/deactivate", deactivateUser);
router.patch("/users/:userId/activate", activateUser);

export default router;
