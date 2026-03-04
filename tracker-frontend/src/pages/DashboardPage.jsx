import { useEffect, useState } from "react";
import { useUserStore } from "../store/user"; // assumes gender is stored here
import { useThemeStore } from "../store/theme"; // Dynamic Environment toggle
import { getCircadianState, getCurrentHour } from "../utils/themeEngine"; // Circadian theme engine
import useDarkMode from "../hooks/useDarkMode"; // optional custom hook
import clsx from "clsx";
import DailyCalendarSection from "../components/Dashboard/DailyCalendarSection";
import DailyTasker from "../components/Dashboard/DailyTasker";
import ClinicIllustration from "../components/UI/ClinicIllustration";
import { FiUsers, FiCalendar, FiDollarSign, FiClipboard, FiTrendingUp, FiTrendingDown, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const motivationalQuotes = [
  "Let's make more smiles today 😄",
  "Every tooth in a man's head is more valuable than a diamond.",
  "Be true to your teeth and they won't be false to you.",
  "A smile is the prettiest thing you can wear.",
  "Creating beautiful smiles, one patient at a time."
];

const DashboardPage = () => {
  const { user } = useUserStore(); // { name: "Dr. Shama", gender: "female" }
  const { isDynamicEnvironment } = useThemeStore(); // Dynamic Environment toggle state
  const isDark = useDarkMode && useDarkMode(); // returns true/false based on system or toggle
  const [quote, setQuote] = useState("");
  
  // Get circadian state based on user gender - always calculate regardless of toggle
  const circadianState = getCircadianState(user.gender);
  
  // Get dynamic greeting - always use circadian greeting regardless of toggle
  const getGreeting = () => {
    return circadianState.greeting;
  };
  const [metrics, setMetrics] = useState({
    totalPatients: 1247,
    todayAppointments: 18,
    monthlyRevenue: 45600,
    pendingTreatments: 23,
    patientGrowth: 12.5,
    revenueGrowth: 8.3,
    appointmentGrowth: -2.1,
    treatmentGrowth: 15.7
  });


  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  // Chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [42000, 38000, 45000, 48000, 52000, 45600],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const appointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 22, 18, 8, 5],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 8,
      },
    ],
  };
  const treatmentData = {
    labels: ['Cleanings', 'Fillings', 'Root Canals', 'Crowns', 'Other'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };
  // Get chart options with adaptive text colors
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { display: false },
          ticks: {
            color: isDynamicEnvironment && circadianState?.theme === 'night' ? '#ffffff' : '#1f2937'
          }
        },
        x: { 
          grid: { display: false },
          ticks: {
            color: isDynamicEnvironment && circadianState?.theme === 'night' ? '#ffffff' : '#1f2937'
          }
        },
      },
    };
    return baseOptions;
  };

  const chartOptions = getChartOptions();

  // Get Dashboard background style
  const getDashboardBackgroundStyle = () => {
    // Safety: If toggle is OFF, MUST return to original minimalist light grey/white background
    if (!isDynamicEnvironment) {
      return {
        backgroundImage: `url('/images/dashboard-bg.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e0e7ef',
      };
    }
    // When ON: no background (parent AppLayout handles it)
    return {};
  };

  // Get greeting banner classes
  const getGreetingBannerClasses = () => {
    // When toggle is OFF: Glass effect for see-through banner
    if (!isDynamicEnvironment) {
      return 'bg-white/10 backdrop-blur-xl border-white/20';
    }
    // When toggle is ON: Pure transparency - completely see-through, no background
    return 'bg-transparent border-transparent';
  };

  // Get greeting text colors
  const getGreetingTextColors = () => {
    // When toggle is OFF: Dark text for glass effect (readable on light background)
    if (!isDynamicEnvironment) {
      return {
        heading: 'text-gray-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]',
        quote: 'text-gray-700 drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]'
      };
    }
    // When toggle is ON: Dynamic text color based on hour
    const currentHour = getCurrentHour();
    const isDaylight = currentHour >= 6 && currentHour < 18; // 6 AM - 5:59 PM
    
    if (isDaylight) {
      // Daylight hours: Black text for high contrast
      return {
        heading: 'text-gray-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]',
        quote: 'text-gray-800 drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]'
      };
    }
    
    // Night hours: White text with shadow for visibility
    return {
      heading: 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
      quote: 'text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
    };
  };

  const textColors = getGreetingTextColors();

  // Get adaptive placard text colors for top 4 metric cards
  const getMetricCardColors = () => {
    // Safety: If toggle is OFF, MUST revert to original Minimalist UI colors
    if (!isDynamicEnvironment) {
      return {
        title: 'text-gray-600',
        value: 'text-gray-900'
      };
    }
    
    // Dynamic text color based on recordingHour (or current hour)
    const currentHour = getCurrentHour();
    const isNight = currentHour >= 18 || currentHour < 6; // Night: 18:00 - 05:59
    
    if (isNight) {
      // Night Mode (18:00 - 05:59): white text for readability
      return {
        title: 'text-white',
        value: 'text-white'
      };
    }
    
    // Day Mode (06:00 - 17:59): black text for readability
    return {
      title: 'text-gray-900',
      value: 'text-gray-900'
    };
  };

  // Get adaptive text colors for chart placards
  const getChartCardColors = () => {
    // Safety: If toggle is OFF, MUST revert to original Minimalist UI colors
    if (!isDynamicEnvironment) {
      return {
        title: 'text-gray-900'
      };
    }
    
    // Dynamic text color based on recordingHour (or current hour)
    const currentHour = getCurrentHour();
    const isNight = currentHour >= 18 || currentHour < 6; // Night: 18:00 - 05:59
    
    if (isNight) {
      // Night Mode (18:00 - 05:59): white text for readability
      return {
        title: 'text-white'
      };
    }
    
    // Day Mode (06:00 - 17:59): black text for readability
    return {
      title: 'text-gray-900'
    };
  };

  const metricColors = getMetricCardColors();
  const chartColors = getChartCardColors();

  return (
    <div
      className={`min-h-screen w-full transition-all duration-300 ${isDynamicEnvironment ? 'dynamic-bg-container' : ''}`}
      style={getDashboardBackgroundStyle()}
    >
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Header - Pure Transparent Greeting Board */}
        <div className={`flex items-center justify-between header-spacing ${getGreetingBannerClasses()} p-6 rounded-xl transition-all duration-300 ${!isDynamicEnvironment ? 'shadow-lg border' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#d4af37] to-[#f2d472] rounded-full flex items-center justify-center text-[#1a222c] text-2xl font-bold shadow-xl border-2 border-[#f2d472]">
              DS
            </div>
            <div>
              <h1 className={`text-4xl font-light tracking-wide ${textColors.heading}`}>{getGreeting()}, Dr. Shama</h1>
              <p className={`text-lg mt-1 ${textColors.quote} animate-fade-in`}>{quote}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <ClinicIllustration />
          </div>
        </div>
        {/* Metric Cards - single row, compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 p-4 flex flex-col items-start justify-center min-w-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className={`text-xs font-medium ${metricColors.title}`}>Total Patients</p>
                <p className={`text-xl font-bold ${metricColors.value} mt-1`}>{metrics.totalPatients.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.patientGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center ml-2">
                <FiUsers className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 p-4 flex flex-col items-start justify-center min-w-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className={`text-xs font-medium ${metricColors.title}`}>Today's Appointments</p>
                <p className={`text-xl font-bold ${metricColors.value} mt-1`}>{metrics.todayAppointments}</p>
                <div className="flex items-center mt-1">
                  {metrics.appointmentGrowth >= 0 ? <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />}
                  <span className={`text-xs font-medium ${metrics.appointmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(metrics.appointmentGrowth)}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center ml-2">
                <FiCalendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 p-4 flex flex-col items-start justify-center min-w-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className={`text-xs font-medium ${metricColors.title}`}>Monthly Revenue</p>
                <p className={`text-xl font-bold ${metricColors.value} mt-1`}>${metrics.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.revenueGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center ml-2">
                <FiDollarSign className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 p-4 flex flex-col items-start justify-center min-w-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className={`text-xs font-medium ${metricColors.title}`}>Pending Treatments</p>
                <p className={`text-xl font-bold ${metricColors.value} mt-1`}>{metrics.pendingTreatments}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.treatmentGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center ml-2">
                <FiClipboard className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Daily Calendar Section - Calendar and Today's Checklist */}
        <div className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DailyCalendarSection />
          <DailyTasker />
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-spacing section-spacing">
          {/* Revenue Trend */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <h3 className={`text-lg font-semibold ${chartColors.title} mb-4`}>Revenue Trend</h3>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          {/* Weekly Appointments */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <h3 className={`text-lg font-semibold ${chartColors.title} mb-4`}>Weekly Appointments</h3>
            <div className="h-64">
              <Bar data={appointmentData} options={chartOptions} />
            </div>
          </div>
        </div>
        {/* Treatment Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-spacing section-spacing">
          {/* Treatment Distribution */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <h3 className={`text-lg font-semibold ${chartColors.title} mb-4`}>Treatment Distribution</h3>
            <div className="h-64">
              <Doughnut data={treatmentData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      color: isDynamicEnvironment && circadianState?.theme === 'night' ? '#ffffff' : '#1f2937'
                    }
                  } 
                },
              }} />
            </div>
          </div>
          {/* Quick Actions 2x2 grid */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding flex flex-col h-full shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg p-4 flex flex-col items-center" onClick={() => window.location.href = '/patients/new'}>
                <FiUsers className="w-6 h-6 mb-2" />
                New Patient
              </button>
              <button className="bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-4 flex flex-col items-center" onClick={() => window.location.href = '/appointments'}>
                <FiCalendar className="w-6 h-6 mb-2" />
                Schedule Appointment
              </button>
              <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg p-4 flex flex-col items-center" onClick={() => window.location.href = '/treatments'}>
                <FiClipboard className="w-6 h-6 mb-2" />
                Create Treatment Plan
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-4 flex flex-col items-center" onClick={() => window.location.href = '/reports'}>
                <FiTrendingUp className="w-6 h-6 mb-2" />
                View Reports
              </button>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'appointment', message: 'New appointment scheduled for John Doe', time: '2 hours ago', icon: FiCheckCircle, color: 'text-green-500' },
              { type: 'patient', message: 'Patient Sarah Wilson updated their medical history', time: '4 hours ago', icon: FiUsers, color: 'text-blue-500' },
              { type: 'treatment', message: 'Treatment plan completed for Mike Johnson', time: '6 hours ago', icon: FiClipboard, color: 'text-yellow-500' },
              { type: 'alert', message: 'Lab work results ready for review', time: '1 day ago', icon: FiAlertCircle, color: 'text-red-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
