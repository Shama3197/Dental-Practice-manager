import { useEffect, useState } from "react";
import { useUserStore } from "../store/user"; // assumes gender is stored here
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
  const [bgImage, setBgImage] = useState("");
  const isDark = useDarkMode && useDarkMode(); // returns true/false based on system or toggle
  const [quote, setQuote] = useState("");
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
    const hour = new Date().getHours();
    const gender = user.gender?.toLowerCase(); // "male" or "female"

    const getTimeOfDay = () => {
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 18) return "noon";
      return "evening";
    };

    const time = getTimeOfDay();
    let prefix = "unisex";
    if (time !== "morning") {
      prefix = gender === "male" ? "male" : "female";
    }
    const imagePath = `/images/bg-${prefix}-${time}.webp`;
    setBgImage(imagePath);
    console.log("Dashboard background image:", imagePath);
  }, [user.gender]);

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
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat transition-all duration-300"
      style={{ 
        backgroundImage: `url('/images/dashboard-bg.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e0e7ef',
      }}
    >
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between header-spacing bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              DS
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Good Morning, Dr. Shama</h1>
              <p className="text-gray-600 text-lg mt-1 animate-fade-in">{quote}</p>
            </div>
          </div>
          <ClinicIllustration />
        </div>
        {/* Metric Cards - single row, compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-start justify-center min-w-0">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Patients</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metrics.totalPatients.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.patientGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center ml-2">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-start justify-center min-w-0">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-gray-600">Today's Appointments</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metrics.todayAppointments}</p>
                <div className="flex items-center mt-1">
                  {metrics.appointmentGrowth >= 0 ? <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />}
                  <span className={`text-xs font-medium ${metrics.appointmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(metrics.appointmentGrowth)}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center ml-2">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-start justify-center min-w-0">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">${metrics.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.revenueGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center ml-2">
                <FiDollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-start justify-center min-w-0">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-gray-600">Pending Treatments</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metrics.pendingTreatments}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-600">{metrics.treatmentGrowth}%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center ml-2">
                <FiClipboard className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* Daily Calendar Section - moved up */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DailyCalendarSection />
          <DailyTasker />
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-spacing section-spacing">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          {/* Weekly Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointments</h3>
            <div className="h-64">
              <Bar data={appointmentData} options={chartOptions} />
            </div>
          </div>
        </div>
        {/* Treatment Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-spacing section-spacing">
          {/* Treatment Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Distribution</h3>
            <div className="h-64">
              <Doughnut data={treatmentData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }} />
            </div>
          </div>
          {/* Quick Actions 2x2 grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding flex flex-col h-full">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
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
