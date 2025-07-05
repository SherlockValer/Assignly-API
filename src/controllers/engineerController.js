import User from "../models/userModel.js";
import Assignment from "../models/assignmentModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllEngineers = catchAsync(async (req, res, next) => {
  let filter = { role: "engineer" };
  if (req.query.skills) {
    const skills = req.query.skills.split(",").map((s) => s.trim());
    filter.skills = { $in: skills };
  }
  const engineers = await User.find(filter);
  res.status(200).json({ status: "success", engineers });
});

export const getEngineerCapacity = catchAsync(async (req, res, next) => {
  const engineer = await User.findById(req.params.id);
  if (!engineer || engineer.role !== "engineer") {
    return next(new AppError("Engineer not found", 404));
  }
  const activeAssignments = await Assignment.find({
    engineerId: engineer._id,
    endDate: { $gte: new Date() },
  });
  const totalAllocated = activeAssignments.reduce(
    (sum, a) => sum + a.allocationPercentage,
    0
  );
  const availableCapacity = engineer.maxCapacity - totalAllocated;
  res.status(200).json({
    status: "success",
    engineer: engineer.name,
    maxCapacity: engineer.maxCapacity,
    totalAllocated,
    availableCapacity,
  });
});

export const updateEngineerProfile = catchAsync(async (req, res, next) => {
  // Only allow updating safe fields
  const allowedFields = ["name", "skills", "seniority", "department"];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const engineer = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!engineer) {
    return next(new AppError("Engineer not found", 404));
  }
  res.status(200).json({ status: "success", engineer });
});

export const getEngineerAvailability = catchAsync(async (req, res, next) => {
  const engineer = await User.findById(req.params.id);
  if (!engineer || engineer.role !== "engineer") {
    return next(new AppError("Engineer not found", 404));
  }
  const now = new Date();
  const assignments = await Assignment.find({
    engineerId: engineer._id,
    endDate: { $gte: now },
  });
  let availableDate = now;
  if (assignments.length > 0) {
    availableDate = new Date(
      Math.max(...assignments.map((a) => a.endDate.getTime()))
    );
  }
  res.status(200).json({
    status: "success",
    engineer: engineer.name,
    availableDate,
  });
});

export const getTeamUtilization = catchAsync(async (req, res, next) => {
  const engineers = await User.find({ role: "engineer" });
  const now = new Date();
  let totalCapacity = 0;
  let totalAllocated = 0;
  const utilization = [];
  for (const engineer of engineers) {
    const assignments = await Assignment.find({
      engineerId: engineer._id,
      endDate: { $gte: now },
    });
    const allocated = assignments.reduce(
      (sum, a) => sum + a.allocationPercentage,
      0
    );
    totalCapacity += engineer.maxCapacity;
    totalAllocated += allocated;
    utilization.push({
      name: engineer.name,
      allocated,
      maxCapacity: engineer.maxCapacity,
      percent: Math.round((allocated / engineer.maxCapacity) * 100),
    });
  }
  const avgUtilization = Math.round((totalAllocated / totalCapacity) * 100);
  const underUtilized = utilization.filter((u) => u.percent < 50);
  const overUtilized = utilization.filter((u) => u.percent > 100);
  res.status(200).json({
    status: "success",
    avgUtilization,
    underUtilized,
    overUtilized,
    utilization,
  });
});
