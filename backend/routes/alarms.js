const express = require("express");
const {
  createAlarm,
  getAlarms,
  getAlarm,
  deleteAlarm,
  updateAlarm,
} = require("../controllers/alarmController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all alarm routes
router.use(requireAuth);

// GET all alarms
router.get("/", getAlarms);

//GET a single alarm
router.get("/:id", getAlarm);

// POST a new alarm
router.post("/", createAlarm);

// DELETE an alarm
router.delete("/:id", deleteAlarm);

// UPDATE an alarm
router.patch("/:id", updateAlarm);

module.exports = router;
