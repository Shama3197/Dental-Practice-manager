const express = require("express");
const router = express.Router();

// ⚠️ Secure keys, token checks, and audit logs to be added later

router.post("/send", async (req, res) => {
  const { phone, message, method } = req.body;
  // Simulate actual integration
  console.log(`[SIMULATED] ${method.toUpperCase()} to ${phone}: ${message}`);
  // Later: integrate with Twilio/Gupshup/etc.
  return res.status(200).json({ success: true });
});

module.exports = router; 