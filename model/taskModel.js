const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Work", "Personal", "Shopping", "Other"],
      default: "Other",
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "In-progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Task", taskSchema);
