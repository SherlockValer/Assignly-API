import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  getSuitableEngineers,
} from "../controllers/projectController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, restrictTo("manager"), createProject);
router.get("/:id/suitable-engineers", protect, getSuitableEngineers);

export default router;
