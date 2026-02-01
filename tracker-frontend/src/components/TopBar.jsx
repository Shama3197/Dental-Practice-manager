import React from 'react';
import { MdSearch, MdNotifications, MdSettings } from 'react-icons/md';

function TopBar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-heading font-bold text-primary">Dental Practice Manager</h1>
          </div>

          {/* Left Section: Greeting and Time */}
          <div className="flex flex-col">
            <h2 className="text-gray-800 text-2xl font-semibold">
              Good {getGreeting()}, Doctor
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {formattedDate}, {formattedTime}
            </p>
          </div>

          {/* Right Section: Search, Notifications, User Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar (Placeholder) */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Notifications Icon (Placeholder) */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <MdNotifications className="text-gray-600 text-xl" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <span className="font-medium text-text">
                Welcome
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

export default TopBar; 