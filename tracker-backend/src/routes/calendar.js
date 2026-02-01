const express = require("express");
const router = express.Router();

// Placeholder for token (to be secured later)
const MOCK_USER_TOKEN = "test-token";

// [GET] Fetch Google Calendar Events for a given day
router.get("/", async (req, res) => {
  const { date } = req.query;

  // Placeholder mock
  return res.json([
    { task: `Sample synced task from Google on ${new Date(date).toDateString()}` },
  ]);
});

// [POST] Create new Google Calendar task (event)
router.post("/", async (req, res) => {
  const { date, task } = req.body;

  // Placeholder: simulate pushing to Google Calendar
  console.log(`New Task: ${task} scheduled on ${date}`);

  // Simulate saved task
  return res.status(201).json({ task });
});

module.exports = router; 