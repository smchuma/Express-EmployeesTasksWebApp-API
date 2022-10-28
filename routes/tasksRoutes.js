const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksControllers");

router
  .route("/")
  .get(tasksController.getAllTasks)
  .post(tasksController.createNewTask)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
