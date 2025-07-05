import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["planning", "active", "completed"],
    default: "planning",
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
