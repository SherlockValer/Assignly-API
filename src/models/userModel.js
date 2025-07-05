import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["engineer", "manager"],
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  seniority: {
    type: String,
    enum: ["junior", "mid", "senior"],
  },
  maxCapacity: {
    type: Number,
    enum: [100, 50],
    required: true,
  },
  department: {
    type: String,
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
