const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: string,
    required: true,
  },
  roles: [
    {
      type: string,
      default: "Employee",
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
