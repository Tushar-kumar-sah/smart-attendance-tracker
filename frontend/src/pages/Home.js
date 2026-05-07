import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-black via-zinc-900 to-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
          <p className="inline-block bg-zinc-800 text-blue-400 px-5 py-2 rounded-full text-sm mb-6 border border-zinc-700">
            📊 Smart Attendance Tracker
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            Track Attendance
            <span className="block bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Smarter Than Ever
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Add subjects, build a flexible weekly routine, mark attendance daily, 
            and view detailed analytics – all in one student‑friendly dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-500 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition duration-300 shadow-lg shadow-blue-500/20"
            >
              Register Now
            </button>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="border border-zinc-700 hover:bg-zinc-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg transition duration-300"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Everything You Need</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Built specifically for students – from routine planning to attendance analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📚</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Subjects & Teachers</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Add unlimited subjects with teacher names. Easily manage your entire curriculum.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🗓️</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Dynamic Weekly Routine</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Customize periods per day (1–12), assign subjects to each slot – timetable updates instantly.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">✅</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Mark Attendance</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              One‑tap Present/Absent for every subject. Visual feedback and real‑time status badges.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📅</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Monthly Overview</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Calendar view with daily status dots. Hover or tap to see exact attendance percentage.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📊</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Analytics Dashboard</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Real‑time stats: total subjects, present count, absent count, and overall attendance %.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📱</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Mobile Optimized</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Fully responsive design – works flawlessly on phones, tablets, and desktops.
            </p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-zinc-800 bg-zinc-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-blue-400">1–12</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-3">Periods per Day</p>
          </div>
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-purple-400">Unlimited</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-3">Subjects</p>
          </div>
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-green-400">Real‑time</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-3">Attendance %</p>
          </div>
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-red-400">100%</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 sm:mt-3">Mobile Friendly</p>
          </div>
        </div>
      </section>

      {/* DEMO MODAL */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-4xl w-full border border-white/20 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-xl font-semibold">Watch Demo</h3>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-gray-400 text-sm text-center mt-4">
                Watch how to add subjects, manage routine, and track attendance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 