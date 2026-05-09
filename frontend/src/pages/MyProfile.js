import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyProfile() {
  const USER_ID = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [periodsCount, setPeriodsCount] = useState(6);
  const [routine, setRoutine] = useState({
    Monday: Array(6).fill(""),
    Tuesday: Array(6).fill(""),
    Wednesday: Array(6).fill(""),
    Thursday: Array(6).fill(""),
    Friday: Array(6).fill(""),
  });
  const [attendance, setAttendance] = useState({});
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editTeacherName, setEditTeacherName] = useState("");

  // Current month/year
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date(); // for current date highlight

  // Compute daily stats
  const recomputeDailyAttendance = useCallback((records) => {
    const dailyStats = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const start = new Date(dateStr);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const dayRecords = records.filter(r => {
        const recDate = new Date(r.date);
        return recDate >= start && recDate < end;
      });

      const presentSet = new Set();
      const totalSet = new Set();
      dayRecords.forEach(r => {
        totalSet.add(r.subjectName);
        if (r.status === "Present") presentSet.add(r.subjectName);
      });
      const presentCountDay = presentSet.size;
      const totalCountDay = totalSet.size;
      const percentage = totalCountDay === 0 ? 0 : Math.round((presentCountDay / totalCountDay) * 100);
      let dotColor = "bg-gray-500";
      if (totalCountDay > 0) {
        if (percentage >= 80) dotColor = "bg-green-500";
        else if (percentage >= 50) dotColor = "bg-yellow-500";
        else dotColor = "bg-red-500";
      }
      dailyStats.push({ day, percentage, presentCount: presentCountDay, totalCount: totalCountDay, dotColor });
    }
    setDailyAttendance(dailyStats);
  }, [currentYear, currentMonth, daysInMonth]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!USER_ID) return;
      try {
        setLoading(true);
        // Subjects
        const subjectsRes = await api.get(`/subjects?userId=${USER_ID}`);
        setSubjects(subjectsRes.data);

        // Routine
        const routineRes = await api.get(`/routine?userId=${USER_ID}`);
        if (routineRes.data.routine && Object.keys(routineRes.data.routine).length) {
          setRoutine(routineRes.data.routine);
          setPeriodsCount(routineRes.data.periodsCount);
        } else {
          const defaultRoutine = {
            Monday: Array(6).fill(""),
            Tuesday: Array(6).fill(""),
            Wednesday: Array(6).fill(""),
            Thursday: Array(6).fill(""),
            Friday: Array(6).fill(""),
          };
          await api.post("/routine", { routine: defaultRoutine, periodsCount: 6, userId: USER_ID });
          setRoutine(defaultRoutine);
          setPeriodsCount(6);
        }

        // Latest attendance (for header)
        const latestRes = await api.get(`/attendance?userId=${USER_ID}`);
        setAttendance(latestRes.data);

        // Attendance history (for monthly calendar)
        const historyRes = await api.get(`/attendance/history?userId=${USER_ID}`);
        recomputeDailyAttendance(historyRes.data);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [USER_ID, recomputeDailyAttendance]);

  // Helper: clean routine when subject is deleted or renamed
  const cleanRoutineForSubject = async (oldSubjectName, newSubjectName = null) => {
    let updatedRoutine = { ...routine };
    let modified = false;
    Object.keys(updatedRoutine).forEach(day => {
      updatedRoutine[day] = updatedRoutine[day].map(sub => {
        if (sub === oldSubjectName) {
          modified = true;
          return newSubjectName !== null ? newSubjectName : "";
        }
        return sub;
      });
    });
    if (modified) {
      setRoutine(updatedRoutine);
      await api.post("/routine", { routine: updatedRoutine, periodsCount, userId: USER_ID });
    }
  };

  // Add subject
  const addSubject = async () => {
    if (!subjectName.trim() || !teacherName.trim()) return;
    try {
      const res = await api.post("/subjects", {
        subjectName: subjectName.trim(),
        teacherName: teacherName.trim(),
        userId: USER_ID,
      });
      setSubjects([...subjects, res.data]);
      setSubjectName("");
      setTeacherName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Edit subject (teacher name only)
  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setEditTeacherName(subject.teacherName);
    setEditModalOpen(true);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    try {
      const updatedSubject = { ...editingSubject, teacherName: editTeacherName.trim() };
      await api.put(`/subjects/${editingSubject._id}`, updatedSubject);
      setSubjects(subjects.map(sub => sub._id === editingSubject._id ? updatedSubject : sub));
      setEditModalOpen(false);
      setEditingSubject(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Delete subject
  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Delete subject "${subject.subjectName}"? This will remove it from routine and attendance.`)) return;
    try {
      await api.delete(`/subjects/${subject._id}`);
      // Remove from subjects list
      const newSubjects = subjects.filter(sub => sub._id !== subject._id);
      setSubjects(newSubjects);
      // Remove from routine dropdowns
      await cleanRoutineForSubject(subject.subjectName, null);
      // Remove from attendance state (local)
      const newAttendance = { ...attendance };
      delete newAttendance[subject.subjectName];
      setAttendance(newAttendance);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Update routine
  const updateRoutine = async (day, index, value) => {
    const updatedRoutine = { ...routine };
    updatedRoutine[day][index] = value;
    setRoutine(updatedRoutine);
    try {
      await api.post("/routine", { routine: updatedRoutine, periodsCount, userId: USER_ID });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeriodsCountChange = async (newCount) => {
    if (newCount < 1) return;
    const updatedRoutine = {};
    Object.keys(routine).forEach((day) => {
      const oldPeriods = routine[day];
      const newPeriods = [...oldPeriods];
      if (newCount > oldPeriods.length) {
        for (let i = oldPeriods.length; i < newCount; i++) newPeriods.push("");
      } else {
        newPeriods.length = newCount;
      }
      updatedRoutine[day] = newPeriods;
    });
    setRoutine(updatedRoutine);
    setPeriodsCount(newCount);
    try {
      await api.post("/routine", { routine: updatedRoutine, periodsCount: newCount, userId: USER_ID });
    } catch (error) {
      console.error(error);
    }
  };

  const markAttendance = async (subject, status) => {
    try {
      await api.post("/attendance", { subjectName: subject, status, userId: USER_ID });
      console.log(`Marked ${subject} as ${status}`);

      // Immediately update latest attendance state (header & weekly)
      setAttendance(prev => ({ ...prev, [subject]: status }));

      // Fetch fresh history to recompute monthly calendar live
      const historyRes = await api.get(`/attendance/history?userId=${USER_ID}`);
      console.log("History records after update:", historyRes.data);
      recomputeDailyAttendance(historyRes.data);
    } catch (error) {
      console.error("Attendance marking error:", error);
    }
  };

  const presentCount = Object.values(attendance).filter(s => s === "Present").length;
  const totalSubjects = subjects.length || 1;
  const attendancePercentage = Math.round((presentCount / totalSubjects) * 100);

  // Authentication guard
  if (!USER_ID) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center max-w-sm mx-4">
          <div className="text-5xl mb-3">🔐</div>
          <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-300 mb-5">Please login to access your dashboard.</p>
          <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl transition">Go to Login</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl mb-8 p-5 md:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Profile</h1>
              <p className="text-gray-400 mt-1 text-sm md:text-lg">Student Attendance Dashboard</p>
            </div>
            <div className="bg-black/40 rounded-2xl px-5 py-3 text-center border border-white/10 w-full lg:w-auto">
              <p className="text-gray-300 text-xs uppercase tracking-wider">Overall Attendance</p>
              <p className="text-4xl md:text-6xl font-bold text-green-400 mt-1">{attendancePercentage}%</p>
            </div>
          </div>
        </div>

        {/* Subjects Section with Edit/Delete */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl mb-8 p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-semibold mb-5 flex items-center gap-2">📚 Subjects & Teachers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base touch-manipulation"
            />
            <input
              type="text"
              placeholder="Teacher name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base touch-manipulation"
            />
            <button
              onClick={addSubject}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl px-5 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 active:scale-95 touch-manipulation"
            >
              + Add Subject
            </button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-gray-300 font-medium">Subject</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Teacher</th>
                  <th className="text-center p-3 text-gray-300 font-medium">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-500">No subjects added. Use the form above.</td>
                  </tr>
                ) : (
                  subjects.map((sub, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-3 font-medium text-sm md:text-base">{sub.subjectName}</td>
                      <td className="p-3 text-gray-300 text-sm md:text-base">{sub.teacherName}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(sub)}
                            className="bg-yellow-600/70 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition active:scale-95"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(sub)}
                            className="bg-red-600/70 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition active:scale-95"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
             </table>
          </div>
        </div>

        {/* Weekly Routine */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl mb-8 p-5 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h2 className="text-xl md:text-3xl font-semibold flex items-center gap-2">🗓️ Weekly Routine</h2>
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl">
              <label className="text-sm text-gray-300 font-medium">Periods/day:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={periodsCount}
                onChange={(e) => handlePeriodsCountChange(parseInt(e.target.value) || 1)}
                className="w-16 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-center focus:border-blue-500 transition text-base touch-manipulation"
              />
            </div>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth">
              <table className="min-w-[640px] md:min-w-full w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-3 text-left border border-white/10 sticky left-0 z-20 bg-gray-900/90 backdrop-blur-sm">Day</th>
                    {Array.from({ length: periodsCount }, (_, i) => (
                      <th key={i} className="p-3 text-center border border-white/10 whitespace-nowrap">P{i+1}</th>
                    ))}
                   </tr>
                </thead>
                <tbody>
                  {Object.keys(routine).map((day) => (
                    <tr key={day} className="hover:bg-white/5 transition">
                      <td className="p-3 font-medium border border-white/10 bg-black/50 sticky left-0 z-10 backdrop-blur-sm">{day}</td>
                      {routine[day].map((subject, idx) => (
                        <td key={idx} className="p-2 border border-white/10">
                          <select
                            value={subject}
                            onChange={(e) => updateRoutine(day, idx, e.target.value)}
                            className="w-full min-w-[100px] bg-black/60 border border-white/20 rounded-lg px-2 py-2.5 text-sm md:text-base focus:border-blue-500 transition touch-manipulation"
                          >
                            <option value="">—</option>
                            {subjects.map((sub, i) => (<option key={i} value={sub.subjectName}>{sub.subjectName}</option>))}
                          </select>
                         </td>
                      ))}
                     </tr>
                  ))}
                </tbody>
               </table>
            </div>
            <div className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-1"><span>← Swipe to see more periods →</span></div>
          </div>
          <p className="text-gray-400 text-sm mt-3 text-center">💡 Adjust periods count – timetable updates automatically. Tap any dropdown to assign subjects.</p>
        </div>

        {/* Mark Attendance */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md border border-white/10 shadow-xl mb-8 p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">✅</span> Mark Attendance
            <span className="text-xs ml-2 px-2 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">Live</span>
          </h2>
          {subjects.length === 0 ? (
            <div className="text-center py-12 px-4 bg-black/30 rounded-2xl border border-dashed border-white/20">
              <p className="text-gray-400 text-lg">📭 No subjects found.</p>
              <p className="text-gray-500 text-sm mt-1">Please add subjects first using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {subjects.map((sub, idx) => {
                const currentStatus = attendance[sub.subjectName];
                return (
                  <div key={idx} className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition duration-500 pointer-events-none"></div>
                    <div className="relative p-5">
                      <div className="flex items-start justify-between">
                        <div><h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{sub.subjectName}</h3><p className="text-gray-400 text-sm mt-0.5 flex items-center gap-1"><span>👩‍🏫</span> {sub.teacherName}</p></div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${currentStatus === "Present" ? "bg-green-500/20 text-green-300 border border-green-500/30" : currentStatus === "Absent" ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>{currentStatus || "Pending"}</div>
                      </div>
                      <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${currentStatus === "Present" ? "w-full bg-green-500" : currentStatus === "Absent" ? "w-0 bg-red-500" : "w-1/3 bg-yellow-500 animate-pulse"}`}></div></div>
                      <div className="flex gap-3 mt-5">
                        <button onClick={() => markAttendance(sub.subjectName, "Present")} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 touch-manipulation ${currentStatus === "Present" ? "bg-green-600 shadow-md shadow-green-500/40 ring-1 ring-green-400/50" : "bg-green-600/60 hover:bg-green-600 hover:shadow-md hover:shadow-green-500/30 backdrop-blur-sm"}`}><span>✅</span> Present</button>
                        <button onClick={() => markAttendance(sub.subjectName, "Absent")} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 touch-manipulation ${currentStatus === "Absent" ? "bg-red-600 shadow-md shadow-red-500/40 ring-1 ring-red-400/50" : "bg-red-600/60 hover:bg-red-600 hover:shadow-md hover:shadow-red-500/30 backdrop-blur-sm"}`}><span>❌</span> Absent</button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">Tap to mark {currentStatus === "Present" ? "present" : "absent"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {subjects.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-white/10">
              <div className="flex gap-4 text-sm"><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-gray-300">Present: {presentCount}</span></div><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-gray-300">Absent: {subjects.length - presentCount}</span></div></div>
              <div className="text-xs text-gray-400 bg-black/30 px-3 py-1 rounded-full">{subjects.length} subject(s) registered</div>
            </div>
          )}
        </div>

        {/* Monthly Overview – Live + Current Date Highlight */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl mb-8 p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-semibold mb-5 flex items-center gap-2">
            📅 Monthly Overview
            <span className="text-xs ml-2 px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">live data</span>
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {dailyAttendance.map(({ day, percentage, presentCount: pCount, totalCount, dotColor }) => {
              // Highlight current date
              const isCurrentDate = (today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day);
              return (
                <div key={day} className={`relative group bg-black/40 rounded-lg p-1.5 sm:p-2 border border-white/10 hover:border-blue-500/50 transition cursor-pointer ${isCurrentDate ? 'ring-2 ring-blue-500 bg-blue-500/20' : ''}`}>
                  <p className="text-xs sm:text-sm font-semibold">{day}</p>
                  <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mx-auto mt-1 ${dotColor}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="text-center">
                      <span className="text-sm sm:text-base font-bold text-white">{totalCount === 0 ? "No data" : `${percentage}%`}</span>
                      <span className="text-[10px] sm:text-xs block text-gray-300">{totalCount === 0 ? "No records" : `${pCount}/${totalCount} present`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs text-gray-400">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500"></span> ≥80% (Good)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> 50-79% (Moderate)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> &lt;50% (Poor)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-500"></span> No data</div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-3">💡 Hover (or tap) to see exact percentage and present/total subjects for that day. Blue ring marks today.</p>
        </div>

        {/* Weekly Analysis */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-5 md:p-8">
          <h2 className="text-xl md:text-3xl font-semibold mb-5 flex items-center gap-2">📊 Weekly Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10 hover:bg-black/60 transition"><p className="text-gray-300 text-xs uppercase tracking-wider">Present</p><p className="text-3xl md:text-5xl font-bold text-green-400 mt-1">{presentCount}</p></div>
            <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10 hover:bg-black/60 transition"><p className="text-gray-300 text-xs uppercase tracking-wider">Total Subjects</p><p className="text-3xl md:text-5xl font-bold text-blue-400 mt-1">{subjects.length}</p></div>
            <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10 hover:bg-black/60 transition"><p className="text-gray-300 text-xs uppercase tracking-wider">Attendance %</p><p className="text-3xl md:text-5xl font-bold text-purple-400 mt-1">{attendancePercentage}%</p></div>
            <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10 hover:bg-black/60 transition"><p className="text-gray-300 text-xs uppercase tracking-wider">Not Present</p><p className="text-3xl md:text-5xl font-bold text-red-400 mt-1">{subjects.length - presentCount}</p></div>
          </div>
        </div>
      </div>

      {/* Edit Subject Modal */}
      {editModalOpen && editingSubject && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-4">Edit Teacher</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Subject (read-only)</label>
              <input
                type="text"
                value={editingSubject.subjectName}
                disabled
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 outline-none text-gray-400"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-1">Teacher Name</label>
              <input
                type="text"
                value={editTeacherName}
                onChange={(e) => setEditTeacherName(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleUpdateSubject} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;