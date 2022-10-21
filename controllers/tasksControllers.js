const User = require("../models/users");
const Task = require("../models/Tasks");
const asyncHandler = require("express-async-handler");

//get all Tasks route  // route GET /tasks //access will be private

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().lean();

  //! if no tasks
  if (!tasks?.length) {
    return res.status(400).json({ message: "No Tasks found" });
  }

  //! Add username to each note before sending the response
  const tasksWithUser = await Promise.all(
    tasks.map(async (task) => {
      const user = await User.findById(task.user).lean().exec();
      return { ...task, username: user.username };
    })
  );

  res.json(tasksWithUser);
});

//create new task route  // route POST /tasks //access will be private

const createNewTask = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  //! Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //! Create and store the new user
  const task = await Task.create({ user, title, text });

  if (task) {
    // Created
    return res.status(201).json({ message: "New task created" });
  } else {
    return res.status(400).json({ message: "Invalid task data received" });
  }
});
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
