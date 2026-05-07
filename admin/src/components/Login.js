import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, role, userId, name } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Admin Panel
        </h1>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold text-white transition duration-200 shadow-lg shadow-blue-500/20"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-xs sm:text-sm text-center mt-5">
          Demo: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}