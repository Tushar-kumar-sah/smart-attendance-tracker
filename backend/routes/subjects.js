const express = require('express');
const Subject = require('../models/Subject');
const router = express.Router();

// GET all subjects for a user
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.query.userId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new subject
router.post('/', async (req, res) => {
  try {
    const { subjectName, teacherName, userId } = req.body;
    const subject = new Subject({ subjectName, teacherName, userId });
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;