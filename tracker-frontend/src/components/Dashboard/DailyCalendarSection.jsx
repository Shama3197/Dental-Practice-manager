import { useState, useEffect } from "react";
import { useThemeStore } from "../../store/theme";
import { useUserStore } from "../../store/user";
import { getCircadianState, getCurrentHour } from "../../utils/themeEngine";
import calendarService from "../../services/calendarService";

export default function DailyCalendarSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();
  
  // Get circadian state for adaptive colors
  const circadianState = getCircadianState(user.gender);

  // Check connection status and fetch events
  useEffect(() => {
    checkConnection();
    fetchEvents();
  }, [selectedDate]);

  const checkConnection = async () => {
    const connected = await calendarService.isConnected();
    setIsConnected(connected);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await calendarService.getEvents(selectedDate);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('Starting Google Calendar authentication...');
      const authUrl = await calendarService.initiateAuth();
      if (authUrl) {
        console.log('Redirecting to Google OAuth:', authUrl);
        window.location.href = authUrl;
      } else {
        throw new Error('No auth URL received from server');
      }
    } catch (error) {
      console.error('Error initiating Google Calendar auth:', error);
      const errorMessage = error.message || error.response?.data?.error || 'Unknown error';
      alert(`Failed to connect to Google Calendar: ${errorMessage}\n\nPlease ensure:\n1. Backend server is running on port 5000\n2. Google Calendar credentials are configured in backend .env file\n3. Check browser console for more details`);
    }
  };

  // Get adaptive text colors based on hour
  const getTextColors = () => {
    if (!isDynamicEnvironment) {
      return {
        title: 'text-gray-800',
        text: 'text-gray-700',
        placeholder: 'text-gray-400',
        border: 'border-gray-200'
      };
    }
    
    // Dynamic text color based on recordingHour (or current hour)
    const currentHour = getCurrentHour();
    const isNight = currentHour >= 18 || currentHour < 6; // Night: 18:00 - 05:59
    
    if (isNight) {
      // Night Mode (18:00 - 05:59): white text for readability
      return {
        title: 'text-white',
        text: 'text-white/90',
        placeholder: 'text-white/60',
        border: 'border-white/20'
      };
    }
    
    // Day Mode (06:00 - 17:59): black text for high contrast
    return {
      title: 'text-gray-900',
      text: 'text-gray-800',
      placeholder: 'text-gray-500',
      border: 'border-gray-300'
    };
  };

  const textColors = getTextColors();

  return (
    <div className="rounded-xl bg-white/20 backdrop-blur-xl p-4 md:p-5 border border-white/20 flex flex-col min-h-[320px] shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-lg font-semibold ${textColors.title}`}>Your Calendar</h2>
        {!isConnected ? (
          <button
            className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 border border-blue-100 shadow-sm"
            onClick={handleGoogleAuth}
          >
            Connect Google Calendar
          </button>
        ) : (
          <span className="px-2.5 py-1.5 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">
            ✓ Connected
          </span>
        )}
      </div>
      <input
        type="date"
        className={`border ${textColors.border} rounded px-3 py-1.5 w-full mb-3 text-sm focus:ring-2 focus:ring-blue-100 ${textColors.text} bg-white/50`}
        value={selectedDate.toISOString().slice(0, 10)}
        onChange={e => setSelectedDate(new Date(e.target.value))}
      />
      
      {/* Calendar Events List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className={`h-40 flex items-center justify-center ${textColors.placeholder} text-sm`}>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className={`h-40 flex items-center justify-center ${textColors.placeholder} text-xs`}>
            {isConnected ? 'No events for this date' : 'Connect Google Calendar to view events'}
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event, index) => {
              const eventTime = event.start 
                ? (event.start.dateTime 
                    ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : event.start.date 
                      ? 'All Day'
                      : null)
                : null;
              
              return (
                <div
                  key={event.id || `event-${index}`}
                  className={`p-2 rounded border ${textColors.border} bg-white/30 ${textColors.text} text-sm`}
                >
                  <div className="font-medium">{event.summary || event.title || 'Untitled Event'}</div>
                  {eventTime && (
                    <div className={`text-xs ${textColors.placeholder} mt-1`}>
                      {eventTime}
                    </div>
                  )}
                  {event.location && (
                    <div className={`text-xs ${textColors.placeholder} mt-1`}>
                      📍 {event.location}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 