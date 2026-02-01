import React from 'react';

const ClinicalMetricCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4 transition-colors duration-200">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default ClinicalMetricCard; 