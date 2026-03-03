import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiActivity,
  FiMessageCircle
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/patients', icon: FiUsers, label: 'Patients' },
    { path: '/appointments', icon: FiCalendar, label: 'Appointments' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/treatments', icon: FiActivity, label: 'Treatments' },
    { path: '/labwork', icon: FiFileText, label: 'Lab Work' },
    { path: '/earnings', icon: FiDollarSign, label: 'Earnings' },
    { path: '/reports', icon: FiFileText, label: 'Reports' },
    { path: '/communications', icon: FiMessageCircle, label: 'Communications' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <div className="w-full h-full bg-[#1a222c] shadow-lg overflow-y-auto sidebar-relative text-[#f8f9fa]">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: "url('/images/oryx-logo-gold.png')" }}>
            {/* Fallback initial if logo image is unavailable */}
            <span className="text-[#f8f9fa] font-semibold text-2xl leading-none tracking-tight mix-blend-screen">O</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#f8f9fa] leading-tight">Oryx</h1>
            <p className="text-xs mt-0.5 text-[#f8f9fa]/60">Practice Management</p>
          </div>
        </div>
        <nav className="space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(212,175,55,0.20)] to-[rgba(242,212,114,0.20)] text-[#f8f9fa] shadow-[0_0_18px_rgba(242,212,114,0.35)] backdrop-blur-sm border border-[#f2d472]/30'
                    : 'text-[#f8f9fa]/80 hover:bg-[#232b36] hover:text-[#f8f9fa]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-gradient-to-b from-[#f2d472] to-[#d4af37] shadow-[0_0_10px_rgba(242,212,114,0.8)]" />
                )}
                <Icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 