const express = require("express");
const taskRouter = express.Router();
const {
  postTask,
  getUsersTask,
  deleteTaskbyUserid,
  editTaskById,
  updateTaskStatus,
} = require("../controller/taskController");
const authorize = require("../middleware/authorization");

//get the user by their user Id
taskRouter.get("/user/:id", authorize, getUsersTask);
taskRouter.post("/", authorize, postTask);
taskRouter.patch("/:taskId", authorize, editTaskById);
taskRouter.patch("/:taskId/status", authorize, updateTaskStatus);
taskRouter.delete("/:taskId", authorize, deleteTaskbyUserid);

module.exports = taskRouter;
