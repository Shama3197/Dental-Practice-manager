import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiUser,
  FiDownload,
  FiBarChart,
  FiPieChart,
  FiEye,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import AddEarningModal from '../components/Financials/AddEarningModal';
import Income from '../components/Income';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate loading and fetch earnings data
    const loadEarnings = async () => {
      try {
        // Mock earnings data
        const mockEarnings = [
          {
            id: 1,
            patientName: 'John Doe',
            patientId: 1,
            treatment: 'Crown',
            amount: 1200,
            date: '2024-02-20',
            paymentMethod: 'Insurance',
            status: 'paid',
            notes: 'Crown placement on tooth #14'
          },
          {
            id: 2,
            patientName: 'Sarah Wilson',
            patientId: 2,
            treatment: 'Deep Cleaning',
            amount: 400,
            date: '2024-02-19',
            paymentMethod: 'Credit Card',
            status: 'paid',
            notes: 'Scaling and root planing'
          },
          {
            id: 3,
            patientName: 'Mike Johnson',
            patientId: 3,
            treatment: 'Root Canal',
            amount: 1500,
            date: '2024-02-18',
            paymentMethod: 'Insurance',
            status: 'paid',
            notes: 'Root canal on tooth #19'
          },
          {
            id: 4,
            patientName: 'Emily Davis',
            patientId: 4,
            treatment: 'Consultation',
            amount: 150,
            date: '2024-02-17',
            paymentMethod: 'Cash',
            status: 'paid',
            notes: 'Initial consultation'
          },
          {
            id: 5,
            patientName: 'Robert Brown',
            patientId: 5,
            treatment: 'Filling',
            amount: 300,
            date: '2024-02-16',
            paymentMethod: 'Insurance',
            status: 'paid',
            notes: 'Composite filling on teeth #5, #6'
          },
          {
            id: 6,
            patientName: 'John Doe',
            patientId: 1,
            treatment: 'X-Ray',
            amount: 150,
            date: '2024-02-15',
            paymentMethod: 'Insurance',
            status: 'paid',
            notes: 'Full mouth X-rays'
          },
          {
            id: 7,
            patientName: 'Sarah Wilson',
            patientId: 2,
            treatment: 'Whitening',
            amount: 300,
            date: '2024-02-14',
            paymentMethod: 'Credit Card',
            status: 'paid',
            notes: 'Professional teeth whitening'
          },
          {
            id: 8,
            patientName: 'Mike Johnson',
            patientId: 3,
            treatment: 'Extraction',
            amount: 300,
            date: '2024-02-13',
            paymentMethod: 'Insurance',
            status: 'paid',
            notes: 'Wisdom tooth extraction'
          }
        ];
        
        setEarnings(mockEarnings);
        setFilteredEarnings(mockEarnings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading earnings:', error);
        setIsLoading(false);
      }
    };

    loadEarnings();
  }, []);

  useEffect(() => {
    // Filter earnings based on search term, patient, and date range
    let filtered = earnings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(earning =>
        earning.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        earning.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply patient filter
    if (selectedPatient !== 'all') {
      filtered = filtered.filter(earning => earning.patientId === parseInt(selectedPatient));
    }

    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const today = new Date();
      const startDate = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(earning => new Date(earning.date) >= startDate);
    }

    setFilteredEarnings(filtered);
  }, [earnings, searchTerm, selectedPatient, selectedDateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);
    const thisMonth = filteredEarnings.filter(earning => {
      const earningDate = new Date(earning.date);
      const now = new Date();
      return earningDate.getMonth() === now.getMonth() && earningDate.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonth.reduce((sum, earning) => sum + earning.amount, 0);
    const avgPerTreatment = filteredEarnings.length > 0 ? totalEarnings / filteredEarnings.length : 0;
    
    return {
      totalEarnings,
      thisMonthTotal,
      avgPerTreatment,
      totalTreatments: filteredEarnings.length
    };
  };

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const monthEarnings = earnings.filter(earning => {
        const earningDate = new Date(earning.date);
        return earningDate.getMonth() === index;
      });
      return {
        month,
        earnings: monthEarnings.reduce((sum, earning) => sum + earning.amount, 0)
      };
    });
    return monthlyData;
  };

  const getTreatmentBreakdown = () => {
    const breakdown = {};
    earnings.forEach(earning => {
      if (breakdown[earning.treatment]) {
        breakdown[earning.treatment] += earning.amount;
      } else {
        breakdown[earning.treatment] = earning.amount;
      }
    });
    return Object.entries(breakdown).map(([treatment, amount]) => ({
      treatment,
      amount
    })).sort((a, b) => b.amount - a.amount);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Patient', 'Treatment', 'Amount', 'Payment Method', 'Status', 'Notes'];
    const csvData = filteredEarnings.map(earning => [
      formatDate(earning.date),
      earning.patientName,
      earning.treatment,
      earning.amount,
      earning.paymentMethod,
      earning.status,
      earning.notes
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const EarningCard = ({ earning }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{earning.patientName}</h3>
            <p className="text-sm text-gray-500">{earning.treatment}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">{formatCurrency(earning.amount)}</p>
          <p className="text-xs text-gray-500">{formatDate(earning.date)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium text-gray-900">{earning.paymentMethod}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {earning.status}
          </span>
        </div>
      </div>

      {earning.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-600 italic">"{earning.notes}"</p>
        </div>
      )}
      
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <FiEye className="w-4 h-4" />
        </button>
        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          <FiEdit className="w-4 h-4" />
        </button>
        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const stats = getStats();
  const monthlyData = getMonthlyData();
  const treatmentBreakdown = getTreatmentBreakdown();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <Income />
    </div>
  );
};

export default Earnings; 