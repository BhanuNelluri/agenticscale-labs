import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DeployAgent from './pages/DeployAgent';

import ClinicDashboard from './pages/dashboards/ClinicDashboard';
import HvacDashboard from './pages/dashboards/HvacDashboard';
import SalonDashboard from './pages/dashboards/SalonDashboard';
import GymDashboard from './pages/dashboards/GymDashboard';
import AutoDashboard from './pages/dashboards/AutoDashboard';
import VetDashboard from './pages/dashboards/VetDashboard';
import RealEstateDashboard from './pages/dashboards/RealEstateDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const renderDashboardByNiche = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.industry) {
      case 'Clinics & Healthcare':
        return <ClinicDashboard user={user} setUser={setUser} />;
      case 'HVAC & Home Services':
        return <HvacDashboard user={user} setUser={setUser} />;
      case 'Salons & MedSpas':
        return <SalonDashboard user={user} setUser={setUser} />;
      case 'Gyms & Fitness Studios':
        return <GymDashboard user={user} setUser={setUser} />;
      case 'Auto Repair & Detailing':
        return <AutoDashboard user={user} setUser={setUser} />;
      case 'Veterinary Clinics':
        return <VetDashboard user={user} setUser={setUser} />;
      case 'Real Estate & Property Management':
        return <RealEstateDashboard user={user} setUser={setUser} />;
      default:
        return <ClinicDashboard user={user} setUser={setUser} />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/deploy" element={user ? <DeployAgent user={user} setUser={setUser} /> : <Navigate to="/login?redirect=deploy" />} />
        <Route path="/dashboard" element={renderDashboardByNiche()} />
      </Routes>
    </Router>
  );
}