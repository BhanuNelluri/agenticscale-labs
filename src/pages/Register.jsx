import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiRegister } from '../services/api';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    businessName: '',
    industry: 'Clinics & Healthcare',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked! Form Payload:", formData);
    setError('');

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      console.warn("Validation failed: Invalid email");
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      console.warn("Validation failed: Password too short");
      return;
    }
    
    const cleanedPhone = formData.phone.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      setError('Please enter a valid phone number (e.g., +12025550143).');
      console.warn("Validation failed: Invalid phone");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending POST request to Google Apps Script...");
      const res = await apiRegister({ ...formData, email: formData.email.trim().toLowerCase(), phone: cleanedPhone });
      console.log("Response received from Google Apps Script:", res);

      if (res && res.status === 'success') {
        setUser(res.user);
        navigate('/deploy');
      } else {
        setError(res?.message || 'Registration failed. Check Apps Script logs.');
      }
    } catch (err) {
      console.error("API Call Exception:", err);
      setError('Failed to connect to backend webhook. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Register Admin User</h2>
          <p className="text-slate-400 text-xs">Provision your master spreadsheet schema and voice agent</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Owner Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.ownerName} 
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Admin Email</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" 
                placeholder="john@clinic.com" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" 
                placeholder="••••••••" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Business Name</label>
              <input 
                type="text" 
                required 
                value={formData.businessName} 
                onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" 
                placeholder="BrightSmile Dental" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Industry Niche</label>
              <select 
                value={formData.industry} 
                onChange={(e) => setFormData({...formData, industry: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none text-slate-200 cursor-pointer focus:border-blue-500"
              >
                <option value="Clinics & Healthcare">Clinics & Healthcare</option>
                <option value="HVAC & Home Services">HVAC & Home Services</option>
                <option value="Salons & MedSpas">Salons & MedSpas</option>
                <option value="Gyms & Fitness Studios">Gyms & Fitness Studios</option>
                <option value="Auto Repair & Detailing">Auto Repair & Detailing</option>
                <option value="Veterinary Clinics">Veterinary Clinics</option>
                <option value="Real Estate & Property Management">Real Estate & Property Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Business Phone</label>
              <input 
                type="text" 
                required 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" 
                placeholder="+12025550143" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm rounded-xl transition mt-4 shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Provisioning Master Registries..." : "Register & Auto-Provision Database"}
          </button>
        </form>
      </div>
    </div>
  );
}