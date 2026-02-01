import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiFilter, 
  FiDownload, 
  FiEdit2, 
  FiTrash2, 
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiBarChart,
  FiSearch,
  FiUser,
  FiEdit,
  FiEye
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

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    source: '',
    minAmount: '',
    maxAmount: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    source: '',
    notes: ''
  });

  const [earnings, setEarnings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchIncomeData();
    fetchStats();
    loadEarnings();
  }, [filters]);

  const fetchIncomeData = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/income?${queryParams}`);
      const data = await response.json();
      setIncomeData(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch income data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.source) queryParams.append('source', filters.source);

      const response = await fetch(`/api/income/stats?${queryParams}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const loadEarnings = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockEarnings = [
        {
          id: 1,
          patientName: 'John Doe',
          service: 'Dental Cleaning',
          amount: 150.00,
          date: '2024-02-20',
          paymentMethod: 'Credit Card',
          status: 'paid',
          notes: 'Regular cleaning appointment'
        },
        {
          id: 2,
          patientName: 'Sarah Wilson',
          service: 'Crown Placement',
          amount: 1200.00,
          date: '2024-02-19',
          paymentMethod: 'Insurance',
          status: 'paid',
          notes: 'Crown placement completed'
        },
        {
          id: 3,
          patientName: 'Mike Johnson',
          service: 'Root Canal',
          amount: 1800.00,
          date: '2024-02-18',
          paymentMethod: 'Insurance',
          status: 'pending',
          notes: 'Insurance claim submitted'
        },
        {
          id: 4,
          patientName: 'Emily Davis',
          service: 'Checkup',
          amount: 100.00,
          date: '2024-02-17',
          paymentMethod: 'Cash',
          status: 'paid',
          notes: 'Annual checkup'
        },
        {
          id: 5,
          patientName: 'Robert Brown',
          service: 'Tooth Extraction',
          amount: 300.00,
          date: '2024-02-16',
          paymentMethod: 'Credit Card',
          status: 'paid',
          notes: 'Wisdom tooth extraction'
        }
      ];
      
      setEarnings(mockEarnings);
      setFilteredEarnings(mockEarnings);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEntry 
        ? `/api/income/${editingEntry._id}`
        : '/api/income';
      
      const method = editingEntry ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingEntry ? 'Income updated successfully' : 'Income added successfully');
        setShowAddForm(false);
        setEditingEntry(null);
        resetForm();
        fetchIncomeData();
        fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save income');
      }
    } catch (error) {
      toast.error('Failed to save income');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Income deleted successfully');
        fetchIncomeData();
        fetchStats();
      } else {
        toast.error('Failed to delete income');
      }
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split('T')[0],
      amount: entry.amount.toString(),
      source: entry.source,
      notes: entry.notes || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      source: '',
      notes: ''
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      source: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  // Chart data
  const monthlyChartData = {
    labels: stats.monthly?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Monthly Income',
        data: stats.monthly?.map(item => item.total) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const sourceChartData = {
    labels: stats.bySource?.map(item => item._id) || [],
    datasets: [
      {
        data: stats.bySource?.map(item => item.total) || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
        ],
      },
    ],
  };

  const sourceBarData = {
    labels: stats.bySource?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Income by Source',
        data: stats.bySource?.map(item => item.total) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return 'bg-blue-100 text-blue-800';
      case 'insurance':
        return 'bg-purple-100 text-purple-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalEarnings = () => {
    return filteredEarnings.reduce((total, earning) => total + earning.amount, 0);
  };

  const calculateMonthlyGrowth = () => {
    // Mock calculation - replace with actual data
    return 12.5;
  };

  const EarningCard = ({ earning }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{earning.patientName}</h3>
            <p className="text-sm text-gray-500">{earning.service}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
            {earning.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(earning.paymentMethod)}`}>
            {earning.paymentMethod}
          </span>
        </div>
      </div>

      <div className="list-spacing mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(earning.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="w-4 h-4 mr-2" />
          <span>{earning.patientName}</span>
        </div>
        <div className="flex items-center text-lg font-semibold text-green-600">
          <FiDollarSign className="w-4 h-4 mr-2" />
          <span>{formatCurrency(earning.amount)}</span>
        </div>
      </div>

      {earning.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-600 italic">
            "{earning.notes}"
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <FiEye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEdit(earning)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <FiEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(earning._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600">Track and analyze your dental practice income</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus /> Add Income
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.summary?.totalIncome?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.summary?.averageIncome?.toFixed(2) || '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.summary?.count || '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCalendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.summary?.maxAmount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiBarChart className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Monthly Income Trend</h3>
          <Line data={monthlyChartData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Income by Source</h3>
          <Doughnut data={sourceChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
            }
          }} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              type="text"
              value={filters.source}
              onChange={(e) => setFilters({...filters, source: e.target.value})}
              placeholder="Filter by source"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
              placeholder="Min amount"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
              placeholder="Max amount"
              className="w-full p-2 border rounded-md"
            />
          </div>
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

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Income Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : incomeData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No income entries found</td>
                </tr>
              ) : (
                incomeData.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${entry.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {entry.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingEntry ? 'Edit Income Entry' : 'Add Income Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  placeholder="e.g., Consultation, Treatment, Lab Work"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Optional notes"
                  className="w-full p-2 border rounded-md"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingEntry ? 'Update' : 'Add'} Income
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEntry(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Earnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-spacing">
        {filteredEarnings.map(earning => (
          <EarningCard key={earning.id} earning={earning} />
        ))}
      </div>

      {filteredEarnings.length === 0 && (
        <div className="text-center py-12">
          <FiDollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedFilter !== 'all' || selectedMonth
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first earning record'
            }
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white button-padding rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
          >
            Add Earning
          </button>
        </div>
      )}
    </div>
  );
};

export default Income; 