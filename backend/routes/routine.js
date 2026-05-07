const express = require('express');
const Routine = require('../models/Routine');
const router = express.Router();

// GET routine
router.get('/', async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.query.userId });
    const routineObj = {};
    let periodsCount = 6;
    routines.forEach(r => {
      routineObj[r.day] = r.periods;
      periodsCount = r.periodsCount;
    });
    res.json({ routine: routineObj, periodsCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST update entire routine
router.post('/', async (req, res) => {
  try {
    const { routine, periodsCount, userId } = req.body;
    await Routine.deleteMany({ userId });
    for (const [day, periods] of Object.entries(routine)) {
      await Routine.create({ day, periods, periodsCount, userId });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;