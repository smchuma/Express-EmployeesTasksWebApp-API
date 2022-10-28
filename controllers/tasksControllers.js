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

  //! duplicates
  const duplicate = await Task.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Task title" });
  }

  //! Create and store the new user
  const task = await Task.create({ user, title, text });

  if (task) {
    return res.status(201).json({ message: "New task created" });
  } else {
    return res.status(400).json({ message: "Invalid task data received" });
  }
});
//update task   // route PATCH /tasks //access will be private
const updateTask = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  //! Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  //! Confirm task exists to update
  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(400).json({ message: "Task not found" }); //? method not working on postman
  }

  //! Check for duplicate title
  const duplicate = await Task.findOne({ title }).lean().exec();

  //! Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate task title" });
  }

  task.user = user;
  task.title = title;
  task.text = text;
  task.completed = completed;

  const updatedTask = await task.save();

  res.json(`'${updatedTask.title}' updated`);
});

//delete a task   // route DELETE /tasks //access will be private
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //! Confirm data
  if (!id) {
    return res.status(400).json({ message: "Task ID required" });
  }

  //! Confirm task exists to delete
  const task = await Task.findById(id).exec();
  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  const result = await task.deleteOne();

  const reply = `Task '${result.title}' with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllTasks,
  createNewTask,
  updateTask,
  deleteTask,
};
