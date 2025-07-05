import Project from "../models/projectModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import User from "../models/userModel.js";

export const getAllProjects = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const projects = await Project.find(filter);
  res.status(200).json({ status: "success", projects });
});

export const getProjectById = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  res.status(200).json({ status: "success", project });
});

export const createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create({
    ...req.body,
    managerId: req.user._id,
  });
  res.status(201).json({ status: "success", project });
});

export const getSuitableEngineers = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  const engineers = await User.find({
    role: "engineer",
    skills: { $in: project.requiredSkills },
  });
  res.status(200).json({ status: "success", engineers });
});
