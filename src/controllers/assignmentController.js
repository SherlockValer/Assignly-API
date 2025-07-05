import Assignment from "../models/assignmentModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

export const getAllAssignments = catchAsync(async (req, res, next) => {
  let filter = {};

  // Filter by engineer if engineerId is provided in query
  if (req.query.engineerId) {
    filter.engineerId = req.query.engineerId;
  }

  const assignments = await Assignment.find(filter)
    .populate("engineerId", "name email seniority department")
    .populate("projectId", "name status requiredSkills teamSize");
  res.status(200).json({ status: "success", assignments });
});

export const createAssignment = catchAsync(async (req, res, next) => {
  const assignment = await Assignment.create(req.body);
  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("engineerId", "name email seniority department")
    .populate("projectId", "name status requiredSkills teamSize");
  res.status(201).json({ status: "success", assignment: populatedAssignment });
});

export const updateAssignment = catchAsync(async (req, res, next) => {
  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!assignment) {
    return next(new AppError("Assignment not found", 404));
  }
  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("engineerId", "name email seniority department")
    .populate("projectId", "name status requiredSkills teamSize");
  res.status(200).json({ status: "success", assignment: populatedAssignment });
});

export const deleteAssignment = catchAsync(async (req, res, next) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) {
    return next(new AppError("Assignment not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

export const getAssignmentTimeline = catchAsync(async (req, res, next) => {
  const assignments = await Assignment.find()
    .populate("engineerId", "name")
    .populate("projectId", "name");
  const timeline = assignments.map((a) => ({
    engineer: a.engineerId.name,
    project: a.projectId.name,
    startDate: a.startDate,
    endDate: a.endDate,
    role: a.role,
  }));
  res.status(200).json({ status: "success", timeline });
});
