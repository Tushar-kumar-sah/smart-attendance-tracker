const express = require('express');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const router = express.Router();

router.get('/students', async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.json(students);
});

router.get('/subjects', async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

router.post('/subjects', async (req, res) => {
  const { name, teacher } = req.body;
  const subject = new Subject({ subjectName: name, teacherName: teacher, userId: 'admin' });
  await subject.save();
  res.json(subject);
});

router.delete('/subjects/:id', async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.get('/attendance-stats', async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const attendanceRecords = await Attendance.aggregate([
    { $group: { _id: '$subjectName', totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } }, totalRecords: { $sum: 1 } } }
  ]);
  res.json({ totalStudents, attendanceRecords });
});

module.exports = router;