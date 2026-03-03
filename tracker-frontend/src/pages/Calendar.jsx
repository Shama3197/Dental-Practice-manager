import React from 'react';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';
import { getCircadianState } from '../utils/themeEngine';
import DailyCalendarSection from '../components/Dashboard/DailyCalendarSection';

const Calendar = () => {
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();
  const circadianState = getCircadianState(user.gender);

  // Get adaptive text colors
  const getTextColors = () => {
    if (!isDynamicEnvironment) {
      return 'text-gray-900';
    }
    if (circadianState?.theme === 'night') {
      return 'text-white';
    }
    return 'text-gray-900';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className={`text-2xl font-bold mb-4 ${getTextColors()}`}>Calendar & Tasks</h1>
      <DailyCalendarSection />
    </div>
  );
};

export default Calendar; 