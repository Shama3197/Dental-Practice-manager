import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import AppointmentList from './AppointmentList';
// import LabworkTimeline from './LabworkTimeline'; // Removed
import QuickNote from './QuickNote';
import ToDoList from './ToDoList';
import ClinicalMetricCard from './ClinicalMetricCard';
import ClinicIllustration from '../UI/ClinicIllustration';
import { MdOutlineMedicalServices, MdOutlinePeopleAlt, MdOutlineRateReview, MdOutlineQueryStats, MdOutlineCalendarToday, MdOutlineScience, MdOutlinePersonAdd } from 'react-icons/md';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiClipboard,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiPlus,
  FiUpload,
  FiEdit3
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingTreatments: 0,
    patientGrowth: 0,
    revenueGrowth: 0,
    appointmentGrowth: 0,
    treatmentGrowth: 0
  });

  useEffect(() => {
    // Simulate loading and fetch dashboard data
    const loadDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockData = {
          totalPatients: 1247,
          todayAppointments: 18,
          monthlyRevenue: 45600,
          pendingTreatments: 23,
          patientGrowth: 12.5,
          revenueGrowth: 8.3,
          appointmentGrowth: -2.1,
          treatmentGrowth: 15.7
        };
        
        setMetrics(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Sample data
  const stats = [
    {
      title: 'Total Appointments',
      value: '12',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-primary',
      trend: 5,
    },
    {
      title: 'Cancellations',
      value: '2',
      icon: (
        <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-error',
      trend: -2,
    },
    {
      title: 'Patients Completed',
      value: '8',
      icon: (
        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-success',
      trend: 3,
    },
    {
      title: 'Patient Requests',
      value: '5',
      icon: (
        <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'text-warning',
      trend: 8,
    },
  ];

  const appointments = [
    {
      time: '09:00 AM',
      patient: 'John Smith',
      procedure: 'Dental Cleaning',
      tags: ['Completed'],
    },
    {
      time: '10:30 AM',
      patient: 'Sarah Johnson',
      procedure: 'Root Canal',
      tags: ['Pending', 'Case Notes Missing'],
    },
    {
      time: '02:00 PM',
      patient: 'Michael Brown',
      procedure: 'Crown Fitting',
      tags: ['No Plan'],
    },
  ];

  const labDeliverables = [
    { patient: 'Alice B.', caseType: 'Crown Prep', dueTime: '09:30 AM', status: 'Pending' },
    { patient: 'Bob C.', caseType: 'Bridge Impression', dueTime: '11:00 AM', status: 'Due' },
    { patient: 'Charlie D.', caseType: 'Denture Relining', dueTime: '01:00 PM', status: 'Completed' },
  ];

  const clinicalMetrics = [
    { title: 'Total Procedures This Week', value: '45', icon: <MdOutlineMedicalServices className="text-blue-500 text-lg" /> },
    { title: 'Missed Follow-Ups', value: '3', icon: <MdOutlinePeopleAlt className="text-orange-500 text-lg" /> },
    { title: 'Patient Satisfaction Score', value: '4.8/5', icon: <MdOutlineRateReview className="text-green-500 text-lg" /> },
    { title: 'Engagement Index', value: '75%', icon: <MdOutlineQueryStats className="text-purple-500 text-lg" /> },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'New Appointment':
        navigate('/appointments');
        break;
      case 'New Lab Work':
        navigate('/labwork');
        break;
      case 'Add Patient Data':
        navigate('/patients/new');
        break;
      default:
        console.log(`Quick action clicked: ${action}`);
    }
  };

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
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const MetricCard = ({ title, value, icon: Icon, growth, isCurrency = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="content-wrapper dashboard-bg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between header-spacing">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Good Morning, Dr. Shama
            </h1>
            <p className="text-gray-600 text-lg mb-0">Welcome back to your dashboard.</p>
          </div>
          <ClinicIllustration />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-spacing section-spacing">
          <MetricCard
            title="Total Patients"
            value={metrics.totalPatients}
            icon={FiUsers}
            growth={metrics.patientGrowth}
          />
          <MetricCard
            title="Today's Appointments"
            value={metrics.todayAppointments}
            icon={FiCalendar}
            growth={metrics.appointmentGrowth}
          />
          <MetricCard
            title="Monthly Revenue"
            value={metrics.monthlyRevenue}
            icon={FiDollarSign}
            growth={metrics.revenueGrowth}
            isCurrency={true}
          />
          <MetricCard
            title="Pending Treatments"
            value={metrics.pendingTreatments}
            icon={FiClipboard}
            growth={metrics.treatmentGrowth}
          />
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
              <Doughnut 
                data={treatmentData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} 
              />
            </div>
          </div>

          {/* Quick Actions 2x2 grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
              <QuickActionCard
                title="New Patient"
                description="Add a new patient to the system"
                icon={FiUsers}
                color="hover:border-blue-300"
                onClick={() => window.location.href = '/patients/new'}
              />
              <QuickActionCard
                title="Schedule Appointment"
                description="Book a new appointment"
                icon={FiCalendar}
                color="hover:border-green-300"
                onClick={() => window.location.href = '/appointments'}
              />
              <QuickActionCard
                title="Create Treatment Plan"
                description="Set up a treatment plan"
                icon={FiClipboard}
                color="hover:border-yellow-300"
                onClick={() => window.location.href = '/treatments'}
              />
              <QuickActionCard
                title="View Reports"
                description="Access analytics and reports"
                icon={FiTrendingUp}
                color="hover:border-purple-300"
                onClick={() => window.location.href = '/reports'}
              />
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

export default Dashboard; 