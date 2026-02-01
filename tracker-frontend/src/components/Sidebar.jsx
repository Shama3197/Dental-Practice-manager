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
    <div className="w-56 bg-gradient-to-b from-blue-50 to-indigo-100 h-screen fixed left-0 top-0 shadow-lg overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">Dental Manager</h1>
            <p className="text-sm text-gray-600">Practice Management</p>
          </div>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
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