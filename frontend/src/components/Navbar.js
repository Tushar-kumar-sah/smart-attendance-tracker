import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-zinc-800">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">

            Smart Attendance

          </h1>

        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <Link
            to="/"
            className="hover:text-blue-400 transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/profile"
            className="hover:text-blue-400 transition duration-300"
          >
            My Profile
          </Link>

          <Link
            to="/login"
            className="hover:text-white transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl transition duration-300 font-medium text-white"
          >
            Register
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-6 flex flex-col gap-5 text-gray-300">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-400"
          >
            My Profile
          </Link>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl text-center text-white transition duration-300"
          >
            Register
          </Link>

        </div>

      )}

    </nav>
  );
}

export default Navbar;