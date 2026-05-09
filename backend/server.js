const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ------------------- Models -------------------

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  userId: String
});

const User = mongoose.model('User', UserSchema);

const SubjectSchema = new mongoose.Schema({
  subjectName: String,
  teacherName: String,
  userId: String
});

const Subject = mongoose.model('Subject', SubjectSchema);

const RoutineSchema = new mongoose.Schema({
  day: String,
  periods: [String],
  periodsCount: Number,
  userId: String
});

const Routine = mongoose.model('Routine', RoutineSchema);

const AttendanceSchema = new mongoose.Schema({
  subjectName: String,
  status: String,
  date: Date,
  userId: String
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

// ------------------- Authentication Middleware -------------------

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  next();
};

// ------------------- Routes -------------------

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        userId: user.userId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      role: user.role,
      userId: user.userId,
      name: user.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userId } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { userId }]
    });

    if (existing) {
      return res.status(400).json({
        msg: 'Email or Student ID already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userId,
      role: 'student'
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        role: 'student',
        userId: newUser.userId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      role: 'student',
      userId: newUser.userId,
      name: newUser.name
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// Subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({
      userId: req.query.userId
    });

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const sub = new Subject(req.body);
    await sub.save();

    res.json(sub);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routine
app.get('/api/routine', async (req, res) => {
  try {
    const routines = await Routine.find({
      userId: req.query.userId
    });

    const routineObj = {};
    let periodsCount = 6;

    routines.forEach(r => {
      routineObj[r.day] = r.periods;
      periodsCount = r.periodsCount;
    });

    res.json({
      routine: routineObj,
      periodsCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/routine', async (req, res) => {
  try {
    await Routine.deleteMany({
      userId: req.body.userId
    });

    for (const [day, periods] of Object.entries(req.body.routine)) {
      await Routine.create({
        day,
        periods,
        periodsCount: req.body.periodsCount,
        userId: req.body.userId
      });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find({
      userId: req.query.userId
    });

    const map = {};

    records.forEach(r => {
      map[r.subjectName] = r.status;
    });

    res.json(map);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { subjectName, status, userId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Attendance.findOneAndUpdate(
      {
        subjectName,
        userId,
        date: {
          $gte: today,
          $lt: tomorrow
        }
      },
      {
        status,
        date: today
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance History
app.get('/api/attendance/history', async (req, res) => {
  try {
    const records = await Attendance.find({
      userId: req.query.userId
    }).sort({ date: 1 });

    res.json(records);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Routes
app.get('/api/admin/students', auth, isAdmin, async (req, res) => {
  try {
    const students = await User.find({
      role: 'student'
    }).select('-password');

    res.json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/user-stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeStudents = await User.countDocuments({
      role: 'student'
    });

    res.json({
      totalUsers,
      activeStudents
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/subjects', auth, isAdmin, async (req, res) => {
  try {
    const subjects = await Subject.find();

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/subjects', auth, isAdmin, async (req, res) => {
  try {
    const { name, teacher } = req.body;

    const sub = new Subject({
      subjectName: name,
      teacherName: teacher,
      userId: 'admin'
    });

    await sub.save();

    res.json(sub);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/subjects/:id', auth, isAdmin, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/attendance-stats', auth, isAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: 'student'
    });

    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: '$subjectName',
          totalPresent: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Present'] },
                1,
                0
              ]
            }
          },
          totalRecords: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalStudents,
      attendanceRecords: stats
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Create Default Admin -------------------

const createDefaultAdmin = async () => {
  try {
    const admin = await User.findOne({
      email: 'admin@example.com'
    });

    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);

      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashed,
        role: 'admin',
        userId: 'admin001'
      });

      console.log('✅ Default admin created');

    } else {
      console.log('ℹ️ Admin already exists');
    }

  } catch (err) {
    console.error('Error creating admin:', err);
  }
};

// ------------------- Start Server -------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await createDefaultAdmin();
});