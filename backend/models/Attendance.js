const mongoose = require('mongoose');
const AttendanceSchema = new mongoose.Schema({
  subjectName: String,
  status: { type: String, enum: ['Present', 'Absent'] },
  date: { type: Date, default: Date.now },
  userId: String
});
module.exports = mongoose.model('Attendance', AttendanceSchema);