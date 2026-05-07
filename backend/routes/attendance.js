const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();

// GET attendance (latest status per subject)
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.query.userId });
    const attendanceMap = {};
    records.forEach(r => { attendanceMap[r.subjectName] = r.status; });
    res.json(attendanceMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST mark attendance for today
router.post('/', async (req, res) => {
  try {
    const { subjectName, status, userId } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await Attendance.findOneAndUpdate(
      { subjectName, userId, date: { $gte: today, $lt: tomorrow } },
      { status },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;