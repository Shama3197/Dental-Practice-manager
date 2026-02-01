import React from 'react';

const DashboardCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm p-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{title}</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard; 