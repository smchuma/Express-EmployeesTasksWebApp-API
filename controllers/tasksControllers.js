const User = require("../models/users");
const Task = require("../models/Tasks");
const asyncHandler = require("express-async-handler");

//get all Tasks route  // route GET /tasks //access will be private
const getAllTasks = asyncHandler(async (req, res) => {});
//create new task route  // route POST /tasks //access will be private
const createNewTask = asyncHandler(async (req, res) => {});
//update task   // route PATCH /tasks //access will be private
const updateTask = asyncHandler(async (req, res) => {});
//delete a task   // route DELETE /tasks //access will be private
const deleteTask = asyncHandler(async (req, res) => {});

module.exports = {
  getAllTasks,
  createNewTask,
  updateTask,
  deleteTask,
};
