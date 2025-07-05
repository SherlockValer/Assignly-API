import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    user,
  });
});

// export const register = catchAsync(async (req, res, next) => {
//   const {
//     email,
//     name,
//     password,
//     role,
//     skills,
//     seniority,
//     maxCapacity,
//     department,
//   } = req.body;
//   if (!email || !name || !password || !role || !maxCapacity) {
//     return next(new AppError("Missing required fields", 400));
//   }
//   const existing = await User.findOne({ email });
//   if (existing) {
//     return next(new AppError("Email already in use", 409));
//   }
//   const user = await User.create({
//     email,
//     name,
//     password,
//     role,
//     skills,
//     seniority,
//     maxCapacity,
//     department,
//   });
//   const token = signToken(user._id);
//   user.password = undefined;
//   res.status(201).json({
//     status: "success",
//     token,
//     user,
//   });
// });
