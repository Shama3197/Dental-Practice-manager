import { FiCalendar, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const dummyStats = [
  {
    title: 'This Week',
    value: '24',
    icon: FiCalendar,
    color: 'from-blue-400 to-blue-600',
    change: '+12%',
    changeType: 'increase',
  },
  {
    title: 'Avg. Duration',
    value: '45 min',
    icon: FiClock,
    color: 'from-purple-400 to-purple-600',
    change: '-5%',
    changeType: 'decrease',
  },
  {
    title: 'Most Common',
    value: 'Cleaning',
    icon: FiTrendingUp,
    color: 'from-green-400 to-green-600',
    change: '32%',
    changeType: 'increase',
  },
  {
    title: 'Missed',
    value: '3',
    icon: FiAlertCircle,
    color: 'from-red-400 to-red-600',
    change: '-2',
    changeType: 'decrease',
  },
];

const AppointmentStats = ({ stats }) => {
  const data = stats && stats.length > 0 ? stats : dummyStats;
  return (
    <div className="space-y-4">
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4
            transform transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <p className={`text-sm font-medium mt-1
                ${stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats; 