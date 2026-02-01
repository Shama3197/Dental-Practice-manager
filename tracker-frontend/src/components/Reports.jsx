import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FiDownload, 
  FiFilter, 
  FiBarChart, 
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
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

const Reports = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [reportType, setReportType] = useState('dashboard');
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    source: '',
    gender: '',
    ageRange: '',
    treatmentType: '',
    labName: '',
    priority: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  useEffect(() => {
    if (reportType !== 'dashboard') {
      fetchReportData();
    }
  }, [reportType, filters]);

  const fetchDashboardData = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`/api/reports/dashboard?${queryParams}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/reports/${reportType}?${queryParams}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      toast.error(`Failed to fetch ${reportType} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type, format = 'json') => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      queryParams.append('format', format);

      const response = await fetch(`/api/reports/export/${type}?${queryParams}`);
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      source: '',
      gender: '',
      ageRange: '',
      treatmentType: '',
      labName: '',
      priority: ''
    });
  };

  // Chart data for dashboard
  const appointmentChartData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [{
      data: [
        dashboardData.appointments?.scheduled || 0,
        dashboardData.appointments?.completed || 0,
        dashboardData.appointments?.cancelled || 0
      ],
      backgroundColor: ['#3B82F6', '#10B981', '#EF4444'],
    }]
  };

  const treatmentChartData = {
    labels: ['Active', 'Completed', 'Draft'],
    datasets: [{
      data: [
        dashboardData.treatments?.active || 0,
        dashboardData.treatments?.completed || 0,
        dashboardData.treatments?.total - (dashboardData.treatments?.active || 0) - (dashboardData.treatments?.completed || 0)
      ],
      backgroundColor: ['#F59E0B', '#10B981', '#6B7280'],
    }]
  };

  const labWorkChartData = {
    labels: ['Pending', 'Received'],
    datasets: [{
      data: [
        dashboardData.labWork?.pending || 0,
        dashboardData.labWork?.received || 0
      ],
      backgroundColor: ['#F59E0B', '#10B981'],
    }]
  };

  const renderDashboard = () => (
    <div className="section-spacing">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-spacing">
        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.appointments?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.patients?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.earnings?.total?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lab Work</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.labWork?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                +{dashboardData.growth?.rate || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 grid-spacing">
        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments Status</h3>
          <div className="h-64">
            <Doughnut data={appointmentChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Status</h3>
          <div className="h-64">
            <Doughnut data={treatmentChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white card-padding rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Work Status</h3>
          <div className="h-64">
            <Doughnut data={labWorkChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportTable = () => {
    if (!reportData.data || reportData.data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data found for the selected filters
        </div>
      );
    }

    const renderTableHeaders = () => {
      switch (reportType) {
        case 'appointments':
          return (
            <>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
            </>
          );
        case 'patients':
          return (
            <>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
            </>
          );
        case 'financial':
          return (
            <>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Income</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
            </>
          );
        default:
          return null;
      }
    };

    const renderTableRow = (item, index) => {
      switch (reportType) {
        case 'appointments':
          return (
            <tr key={item._id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.patient?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {item.treatmentDetails?.join(', ') || 'N/A'}
              </td>
            </tr>
          );
        case 'patients':
          return (
            <tr key={item._id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.contactNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.gender}
              </td>
            </tr>
          );
        case 'financial':
          return (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item._id?.month ? `${item._id.month}/${item._id.year}` : item._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${item.total?.toLocaleString() || '0'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.count}
              </td>
            </tr>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="card-padding border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold capitalize">{reportType} Report</h3>
          <button
            onClick={() => handleExport(reportType)}
            className="flex items-center gap-2 button-padding bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiDownload /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.data.map((item, index) => renderTableRow(item, index))}
            </tbody>
          </table>
        </div>
        {reportData.pagination && (
          <div className="card-padding border-t">
            <p className="text-sm text-gray-600">
              Showing {((reportData.pagination.page - 1) * reportData.pagination.limit) + 1} to{' '}
              {Math.min(reportData.pagination.page * reportData.pagination.limit, reportData.pagination.total)} of{' '}
              {reportData.pagination.total} results
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and data analysis</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Report Type</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { value: 'dashboard', label: 'Dashboard', icon: FiTrendingUp },
            { value: 'appointments', label: 'Appointments', icon: FiCalendar },
            { value: 'patients', label: 'Patients', icon: FiUsers },
            { value: 'financial', label: 'Financial', icon: FiDollarSign },
            { value: 'treatments', label: 'Treatments', icon: FiActivity },
            { value: 'labwork', label: 'Lab Work', icon: FiFileText }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setReportType(type.value)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                reportType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <type.icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {reportType === 'appointments' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
          {reportType === 'patients' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      ) : (
        reportType === 'dashboard' ? renderDashboard() : renderReportTable()
      )}
    </div>
  );
};

export default Reports; 