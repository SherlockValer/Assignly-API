import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import AppError from "./utils/AppError.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());
// Compression
app.use(compression());
// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1", router);

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
