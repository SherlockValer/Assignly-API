import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  allocationPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    trim: true,
    required: true,
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
