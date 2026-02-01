const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);

// Get all tasks for today
router.get("/", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tasks = await Task.find({ createdAt: { $gte: today } }).sort("-createdAt");
  res.json(tasks);
});

// Add task
router.post("/", async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.status(201).json(task);
});

// Toggle completion
router.put("/:id/toggle", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router; 