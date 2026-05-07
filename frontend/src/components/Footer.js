function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-950 via-gray-900 to-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Attendance
            </h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Modern attendance management system for students and colleges. Track, analyze, and improve academic attendance effortlessly.
            </p>
            <div className="flex justify-center sm:justify-start gap-4 mt-5">
              <span className="text-gray-400 hover:text-blue-400 transition cursor-pointer text-xl">🐦</span>
              <span className="text-gray-400 hover:text-blue-400 transition cursor-pointer text-xl">📘</span>
              <span className="text-gray-400 hover:text-blue-400 transition cursor-pointer text-xl">📸</span>
              <span className="text-gray-400 hover:text-blue-400 transition cursor-pointer text-xl">💼</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-center sm:text-left">Quick Links</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li><a href="/dashboard" className="text-gray-400 hover:text-blue-400 transition text-sm">Dashboard</a></li>
              <li><a href="/subjects" className="text-gray-400 hover:text-blue-400 transition text-sm">Subjects</a></li>
              <li><a href="/routine" className="text-gray-400 hover:text-blue-400 transition text-sm">Weekly Routine</a></li>
              <li><a href="/attendance" className="text-gray-400 hover:text-blue-400 transition text-sm">Attendance Reports</a></li>
              <li><a href="/calendar" className="text-gray-400 hover:text-blue-400 transition text-sm">Monthly Overview</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-center sm:text-left">Support</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li><a href="/help" className="text-gray-400 hover:text-blue-400 transition text-sm">Help Center</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-blue-400 transition text-sm">Contact Us</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-blue-400 transition text-sm">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-blue-400 transition text-sm">Terms of Service</a></li>
              <li><a href="/feedback" className="text-gray-400 hover:text-blue-400 transition text-sm">Feedback</a></li>
            </ul>
          </div>

          {/* Newsletter / Stay Updated */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-center sm:text-left">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-3 text-center sm:text-left">
              Get the latest updates and announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Smart Attendance Tracker. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Made with ❤️ for students
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;