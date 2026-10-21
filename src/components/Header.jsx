import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, LogOut } from 'lucide-react';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/90 border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-blue-500/30">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              AgenticScale Labs
            </span>
            <span className="text-[10px] text-slate-400 font-mono -mt-1 tracking-wider uppercase">AI Voice Platform</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
          <a href="#niches" className="hover:text-blue-400 transition">Supported Niches</a>
          <a href="#roi" className="hover:text-blue-400 transition">ROI Calculator</a>
          <a href="#pricing" className="hover:text-blue-400 transition">Subscription Plan</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Client Portal
              </Link>
              <button onClick={() => { setUser(null); navigate('/'); }} className="text-slate-400 hover:text-white p-2">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}