const mongoose = require('mongoose');
const RoutineSchema = new mongoose.Schema({
  day: String,
  periods: [String],
  periodsCount: Number,
  userId: String
});
module.exports = mongoose.model('Routine', RoutineSchema);