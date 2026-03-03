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
import { useThemeStore } from '../store/theme';
import { getCurrentHour } from '../utils/themeEngine';

const Sidebar = () => {
  const location = useLocation();
  const { isDynamicEnvironment, toggleDynamicEnvironment } = useThemeStore();
  
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

  // Get sidebar background classes based on toggle state and time
  const getSidebarClasses = () => {
    if (!isDynamicEnvironment) {
      return 'bg-[#1a222c]'; // Original solid charcoal when OFF
    }
    const currentHour = getCurrentHour();
    const isDaylight = currentHour >= 6 && currentHour < 18; // 6 AM - 5:59 PM
    if (isDaylight) {
      return 'bg-white/20 backdrop-blur-2xl'; // Light glass for daylight
    }
    return 'bg-white/10 backdrop-blur-xl'; // Darker glass for night
  };

  // Get sidebar text color classes based on toggle state and time
  const getSidebarTextClasses = () => {
    if (!isDynamicEnvironment) {
      return {
        base: 'text-[#f8f9fa]',
        muted: 'text-[#f8f9fa]/80',
        label: 'text-[#f8f9fa]/80',
        hover: 'hover:text-[#f8f9fa]'
      };
    }
    const currentHour = getCurrentHour();
    const isDaylight = currentHour >= 6 && currentHour < 18; // 6 AM - 5:59 PM
    if (isDaylight) {
      return {
        base: 'text-gray-900',
        muted: 'text-gray-700',
        label: 'text-gray-800',
        hover: 'hover:text-gray-900'
      };
    }
    return {
      base: 'text-[#f8f9fa]',
      muted: 'text-[#f8f9fa]/80',
      label: 'text-[#f8f9fa]/80',
      hover: 'hover:text-[#f8f9fa]'
    };
  };

  const textClasses = getSidebarTextClasses();

  return (
    <div className={`w-full h-full ${getSidebarClasses()} shadow-lg overflow-y-auto sidebar-relative ${textClasses.base} transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-transparent">
            <img 
              src="/images/oryx-logo-gold.png" 
              alt="Oryx Logo" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className={`text-xl font-extrabold tracking-tight ${textClasses.base} leading-tight drop-shadow-lg`}>Oryx</h1>
            <p className={`text-xs mt-0.5 ${textClasses.muted} drop-shadow-md`}>Practice Management</p>
          </div>
        </div>
        
        {/* Dynamic Environment Toggle */}
        <div className={`mb-4 p-3 rounded-lg ${isDynamicEnvironment && getCurrentHour() >= 6 && getCurrentHour() < 18 ? 'bg-white/10 backdrop-blur-sm border border-gray-300/20' : 'bg-black/20 backdrop-blur-sm border border-white/10'}`}>
          <div className="flex items-center justify-between">
            <label className={`text-xs font-medium ${textClasses.label} cursor-pointer`}>
              Dynamic Environment
            </label>
            <button
              onClick={toggleDynamicEnvironment}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f2d472] focus:ring-offset-2 focus:ring-offset-[#1a222c] ${
                isDynamicEnvironment ? 'bg-[#f2d472]' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={isDynamicEnvironment}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isDynamicEnvironment ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
                    ? isDynamicEnvironment && getCurrentHour() >= 6 && getCurrentHour() < 18
                      ? 'bg-gradient-to-r from-[rgba(212,175,55,0.20)] to-[rgba(242,212,114,0.20)] text-gray-900 shadow-[0_0_18px_rgba(242,212,114,0.35)] backdrop-blur-sm border border-[#f2d472]/30'
                      : 'bg-gradient-to-r from-[rgba(212,175,55,0.20)] to-[rgba(242,212,114,0.20)] text-[#f8f9fa] shadow-[0_0_18px_rgba(242,212,114,0.35)] backdrop-blur-sm border border-[#f2d472]/30'
                    : `${textClasses.muted} ${isDynamicEnvironment && getCurrentHour() >= 6 && getCurrentHour() < 18 ? 'hover:bg-white/10' : 'hover:bg-[#232b36]'} ${textClasses.hover}`
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