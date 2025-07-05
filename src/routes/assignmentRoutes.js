import express from "express";
import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentTimeline,
} from "../controllers/assignmentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllAssignments);
router.post("/", protect, restrictTo("manager"), createAssignment);
router.put("/:id", protect, restrictTo("manager"), updateAssignment);
router.delete("/:id", protect, restrictTo("manager"), deleteAssignment);
router.get("/timeline", protect, getAssignmentTimeline);

export default router;
