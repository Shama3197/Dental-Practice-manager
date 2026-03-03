/**
 * Circadian Theme Engine
 * Returns dynamic UI state based on time of day and user gender
 */

// Helper function to get current hour (for dynamic text colors)
export const getCurrentHour = () => {
  return new Date().getHours();
};

export const getCircadianState = (gender) => {
  const hour = new Date().getHours();
  const normalizedGender = gender?.toLowerCase() || 'female';

  // Morning: 06:00 - 11:59
  if (hour >= 6 && hour < 12) {
    return {
      theme: 'morning',
      bg: '/images/Background_only_morning.jpeg',
      greeting: 'Good Morning'
    };
  }

  // Afternoon: 12:00 - 17:59
  if (hour >= 12 && hour < 18) {
    const genderPrefix = normalizedGender === 'male' ? 'male' : 'female';
    return {
      theme: 'afternoon',
      bg: `/images/background-only-afternoon-${genderPrefix}.png`,
      greeting: 'Good Afternoon'
    };
  }

  // Evening/Night: 18:00 - 05:59
  const genderPrefix = normalizedGender === 'male' ? 'male' : 'female';
  return {
    theme: 'night',
    bg: `/images/background-only-evening-${genderPrefix}.png`,
    greeting: 'Good Evening'
  };
};
