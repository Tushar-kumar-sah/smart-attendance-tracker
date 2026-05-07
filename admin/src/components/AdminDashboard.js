import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const StudentsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch students list
      const studentsRes = await api.get('/admin/students');
      setStudents(studentsRes.data);
      
      // Fetch user stats (total users & active students)
      const statsRes = await api.get('/admin/user-stats');
      setTotalUsers(statsRes.data.totalUsers);
      setActiveStudents(statsRes.data.activeStudents);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'students', label: 'Students', icon: <StudentsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-black/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Zenith<span className="text-white">Attendance</span></h1>
            <p className="text-gray-400 text-sm mt-1">Admin Control Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogoutIcon />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 p-5 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'students' && 'Student Directory'}
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, Admin</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="bg-white/5 rounded-full px-4 py-2 text-sm text-gray-300">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Dashboard Tab – only two cards */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Total Users</span>
                  <span className="text-2xl opacity-50 group-hover:opacity-100 transition">👥</span>
                </div>
                <p className="text-4xl font-bold text-blue-400">{totalUsers}</p>
                <div className="w-full bg-gray-700 h-1 rounded-full mt-3">
                  <div className="bg-blue-400 h-1 rounded-full w-full"></div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Active Students</span>
                  <span className="text-2xl opacity-50 group-hover:opacity-100 transition">🎓</span>
                </div>
                <p className="text-4xl font-bold text-purple-400">{activeStudents}</p>
                <div className="w-full bg-gray-700 h-1 rounded-full mt-3">
                  <div className="bg-purple-400 h-1 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 font-medium">Student</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Student ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-4 font-medium">{student.name}</td>
                        <td className="p-4 text-gray-300">{student.email}</td>
                        <td className="p-4 text-gray-300">{student.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}