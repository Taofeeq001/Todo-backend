const Task = require("../model/taskModel");
const postTask = async (req, res) => {
  try {
    const { title, category, priority, description, startDate } = req.body;
    if (!title || !category || !priority || !description) {
      return res.json({
        message: "All fields are required.",
      });
    }

    console.log(req.body);
    const task = await Task.create({
      title,
      category,
      priority,
      description,
      startDate: startDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An Error occured, please try again",
    });
  }
};
const getUsersTask = async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to get this task(s)",
    });
  }
  try {
    const task = await Task.find({ user: req.params.id });
    if (!task || task.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tasks found for this user",
        data: [],
      });
    }

    // Calculate statistics
    const statistics = {
      total: task.length,
      pending: task.filter((task) => task.status === "Pending").length,
      inProgress: task.filter((task) => task.status === "In-progress").length,
      completed: task.filter((task) => task.status === "Completed").length,
      completionPercentage: Math.round(
        (task.filter((task) => task.status === "Completed").length /
          task.length) *
          100
      ),
    };

    return res.status(200).json({
      success: true,
      message: "Users task retrieved succesfully",
      data: task,
      statistics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured, Kindly retry later",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate status input
    if (!status || !["Pending", "In-progress", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Valid status is required (Pending, In-progress, or Completed)",
      });
    }

    // Verify task exists and belongs to user
    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        user: req.user._id,
      },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to update it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating task status",
    });
  }
};

//Edit user by their id
const editTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, category, priority, description, startDate } = req.body;

    // 1. Verify the task exists and belongs to the user
    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to edit it",
      });
    }

    // 2. Prepare update fields (only update provided fields)
    const updateFields = {};
    if (title) updateFields.title = title;
    if (category) updateFields.category = category;
    if (priority) updateFields.priority = priority;
    if (description) updateFields.description = description;
    if (startDate !== undefined) updateFields.startDate = startDate;

    // 3. Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateFields,
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Edit task error:", error);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the task",
    });
  }
};
// delete task by user id
const deleteTaskbyUserid = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to delete it",
      });
    }

    await Task.deleteOne({ _id: taskId });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { deletedTaskId: taskId },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the task",
    });
  }
};
module.exports = {
  postTask,
  getUsersTask,
  deleteTaskbyUserid,
  editTaskById,
  updateTaskStatus,
};
