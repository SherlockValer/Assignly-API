import express from "express";
import {
  getAllEngineers,
  getEngineerCapacity,
  updateEngineerProfile,
  getEngineerAvailability,
  getTeamUtilization,
} from "../controllers/engineerController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllEngineers);
router.get("/:id/capacity", protect, getEngineerCapacity);
router.patch(
  "/profile",
  protect,
  restrictTo("engineer"),
  updateEngineerProfile
);
router.get("/:id/availability", protect, getEngineerAvailability);
router.get(
  "/analytics/utilization",
  protect,
  restrictTo("manager"),
  getTeamUtilization
);

export default router;
