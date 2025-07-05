import express from "express";
import { login, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/profile", protect, getProfile);
// router.post("/register", register);

export default router;
