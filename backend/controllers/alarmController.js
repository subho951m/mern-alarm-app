const Alarm = require("../models/alarmModel");
const mongoose = require("mongoose");

// get all alarms
const getAlarms = async (req, res) => {
  const user_id = req.user._id;

  const alarms = await Alarm.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(alarms);
};

// get a single alarm
const getAlarm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such alarm" });
  }

  const alarm = await Alarm.findById(id);

  if (!alarm) {
    return res.status(404).json({ error: "No such alarm" });
  }

  res.status(200).json(alarm);
};

// create new alarm
const createAlarm = async (req, res) => {
  const { alarm_time, title, description, state } = req.body;

  let emptyFields = [];

  if (!alarm_time) {
    emptyFields.push("alarm_time");
  }
  if (!title) {
    emptyFields.push("title");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!state) {
    emptyFields.push("state");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const alarm = await Alarm.create({
      alarm_time,
      title,
      description,
      state,
      user_id,
    });
    res.status(200).json(alarm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete an alarm
const deleteAlarm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such alarm" });
  }

  const alarm = await Alarm.findOneAndDelete({ _id: id });

  if (!alarm) {
    return res.status(400).json({ error: "No such alarm" });
  }

  res.status(200).json(alarm);
};

// update an alarm
const updateAlarm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such alarm" });
  }

  const alarm = await Alarm.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!alarm) {
    return res.status(400).json({ error: "No such alarm" });
  }

  res.status(200).json(alarm);
};

module.exports = {
  getAlarms,
  getAlarm,
  createAlarm,
  deleteAlarm,
  updateAlarm,
};
