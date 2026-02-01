import React from 'react';

const AppointmentList = ({ appointments = [] }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success bg-opacity-10 text-success';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'cancelled':
        return 'bg-error bg-opacity-10 text-error';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Appointments</h2>
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                {appointment.time}
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">{appointment.patient}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.procedure}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {appointment.tags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList; 