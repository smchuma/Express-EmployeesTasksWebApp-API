const User = require("../models/users");
const Task = require("../models/Tasks");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//* get all users route  // route GET /users //access will be private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

//* create new user route  // route POST /users //access will be private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //!confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //!check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "username already exists" });
  }

  //!hash the password
  const hashPassword = await bcrypt.hash(password, 10); //salt rounds
  const userObject = { username, password: hashPassword, roles };

  //!create and store the user
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});

//* update user   // route PATCH /users //access will be private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  //!confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  //! check for duplicates

  const duplicate = await User.findOne({ username }).lean().exec();
  //Allow updates to the original user

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(400).json({ message: "username already exist" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    //!hash password
    user.password = await bcrypt.hash(password, 10); //salt rounds
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

//* delete a users   // route DELETE /users //access will be private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User id required" });
  }

  const tasks = await Task.findOne({ user: id }).lean().exec();

  if (tasks?.length) {
    return res.status(400).json({ message: "User has assigned Tasks" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await User.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
