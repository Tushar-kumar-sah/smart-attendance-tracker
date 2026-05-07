const mongoose = require('mongoose');
const SubjectSchema = new mongoose.Schema({
  subjectName: String,
  teacherName: String,
  userId: String
});
module.exports = mongoose.model('Subject', SubjectSchema);