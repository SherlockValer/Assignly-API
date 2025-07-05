import express from "express";
import authRoutes from "./authRoutes.js";
import engineerRoutes from "./engineerRoutes.js";
import projectRoutes from "./projectRoutes.js";
import assignmentRoutes from "./assignmentRoutes.js";

const router = express.Router();

// TODO: Add sub-routers for /auth, /engineers, /projects, /assignments

router.use("/auth", authRoutes);
router.use("/engineers", engineerRoutes);
router.use("/projects", projectRoutes);
router.use("/assignments", assignmentRoutes);

export default router;
