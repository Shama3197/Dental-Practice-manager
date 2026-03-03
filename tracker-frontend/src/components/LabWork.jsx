import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiFileText,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';
import { getCircadianState } from '../utils/themeEngine';

const LabWork = () => {
  const [labWork, setLabWork] = useState([]);
  const [filteredLabWork, setFilteredLabWork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();
  const circadianState = getCircadianState(user.gender);

  // Get adaptive title color
  const getTitleColor = () => {
    if (!isDynamicEnvironment) {
      return 'text-gray-900';
    }
    if (circadianState?.theme === 'night') {
      return 'text-white drop-shadow-lg';
    }
    return 'text-gray-900';
  };

  useEffect(() => {
    // Fetch lab work data from API
    const loadLabWork = async () => {
      try {
        const { getLabWorks } = await import('../api/labwork');
        const response = await getLabWorks({ page: 1, limit: 100 });
        const labWorkData = response.data?.data || response.data || [];
        
        // Transform API data to match component structure
        const transformedLabWork = await Promise.all(labWorkData.map(async (lab) => {
          // Fetch patient data if not populated
          let patientName = 'Unknown Patient';
          let patientEmail = '';
          let patientPhone = '';
          let address = '';
          
          if (lab.patient && typeof lab.patient === 'object' && lab.patient.name) {
            patientName = lab.patient.name;
            patientEmail = lab.patient.email || '';
            patientPhone = lab.patient.phone || '';
            if (lab.patient.address) {
              address = `${lab.patient.address.street || ''}, ${lab.patient.address.city || ''}, ${lab.patient.address.state || ''}`.trim();
            }
          } else if (lab.patient) {
            // Patient is just an ID, fetch it
            try {
              const { API_BASE_URL } = await import('../services/api');
              const patientRes = await fetch(`${API_BASE_URL}/patients/${lab.patient}`);
              if (patientRes.ok) {
                const patient = await patientRes.json();
                patientName = patient.name;
                patientEmail = patient.email || '';
                patientPhone = patient.phone || '';
                if (patient.address) {
                  address = `${patient.address.street || ''}, ${patient.address.city || ''}, ${patient.address.state || ''}`.trim();
                }
              }
            } catch (err) {
              console.error('Error fetching patient:', err);
            }
          }
          
          return {
            id: lab._id,
            patientName: patientName,
            patientEmail: patientEmail,
            patientPhone: patientPhone,
            type: lab.type || lab.caseType || 'Lab Work',
            status: lab.status?.toLowerCase().replace(' ', '_') || 'pending',
            orderDate: lab.sentDate ? new Date(lab.sentDate).toISOString().split('T')[0] : 
                      lab.createdAt ? new Date(lab.createdAt).toISOString().split('T')[0] : '',
            expectedDate: lab.receivedDate ? new Date(lab.receivedDate).toISOString().split('T')[0] : '',
            labName: lab.labName || 'Lab',
            labPhone: '',
            notes: lab.notes || '',
            address: address
          };
        }));
        
        setLabWork(transformedLabWork);
        setFilteredLabWork(transformedLabWork);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading lab work:', error);
        // Fallback to mock data if API fails
        const mockLabWork = [
          {
            id: 1,
            patientName: 'John Doe',
            patientEmail: 'john.doe@email.com',
            patientPhone: '(555) 123-4567',
            type: 'Crown',
            status: 'in_progress',
            orderDate: '2024-02-15',
            expectedDate: '2024-02-25',
            labName: 'Dental Lab Pro',
            labPhone: '(555) 987-6543',
            notes: 'Porcelain crown for tooth #14',
            address: '123 Main St, City, State'
          },
          {
            id: 2,
            patientName: 'Sarah Wilson',
            patientEmail: 'sarah.wilson@email.com',
            patientPhone: '(555) 234-5678',
            type: 'Bridge',
            status: 'completed',
            orderDate: '2024-02-10',
            expectedDate: '2024-02-20',
            labName: 'Precision Dental Lab',
            labPhone: '(555) 876-5432',
            notes: '3-unit bridge for teeth #18-20',
            address: '456 Oak Ave, City, State'
          },
          {
            id: 3,
            patientName: 'Mike Johnson',
            patientEmail: 'mike.johnson@email.com',
            patientPhone: '(555) 345-6789',
            type: 'Denture',
            status: 'pending',
            orderDate: '2024-02-18',
            expectedDate: '2024-03-01',
            labName: 'Quality Dental Lab',
            labPhone: '(555) 765-4321',
            notes: 'Full upper denture',
            address: '789 Pine Rd, City, State'
          },
          {
            id: 4,
            patientName: 'Emily Davis',
            patientEmail: 'emily.davis@email.com',
            patientPhone: '(555) 456-7890',
            type: 'Veneer',
            status: 'in_progress',
            orderDate: '2024-02-16',
            expectedDate: '2024-02-26',
            labName: 'Elite Dental Lab',
            labPhone: '(555) 654-3210',
            notes: 'Porcelain veneers for teeth #8-9',
            address: '321 Elm St, City, State'
          },
          {
            id: 5,
            patientName: 'Robert Brown',
            patientEmail: 'robert.brown@email.com',
            patientPhone: '(555) 567-8901',
            type: 'Implant',
            status: 'completed',
            orderDate: '2024-02-05',
            expectedDate: '2024-02-15',
            labName: 'Advanced Dental Lab',
            labPhone: '(555) 543-2109',
            notes: 'Implant crown for tooth #30',
            address: '654 Maple Dr, City, State'
          }
        ];
        
        setLabWork(mockLabWork);
        setFilteredLabWork(mockLabWork);
        setIsLoading(false);
      }
    };

    loadLabWork();
  }, []);

  useEffect(() => {
    // Filter lab work based on search term and selected filter
    let filtered = labWork;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.labName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    setFilteredLabWork(filtered);
  }, [labWork, searchTerm, selectedFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'crown':
        return 'bg-purple-100 text-purple-800';
      case 'bridge':
        return 'bg-indigo-100 text-indigo-800';
      case 'denture':
        return 'bg-pink-100 text-pink-800';
      case 'veneer':
        return 'bg-teal-100 text-teal-800';
      case 'implant':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <FiClock className="w-4 h-4" />;
      case 'pending':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const LabWorkCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <FiFileText className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.patientName}</h3>
            <p className="text-sm text-gray-500">{item.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status.replace('_', ' ')}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
            {item.type}
          </span>
        </div>
      </div>

      <div className="list-spacing mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>Ordered: {formatDate(item.orderDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="w-4 h-4 mr-2" />
          <span>Expected: {formatDate(item.expectedDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="w-4 h-4 mr-2" />
          <span>{item.patientName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiFileText className="w-4 h-4 mr-2" />
          <span>{item.labName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{item.address}</span>
        </div>
      </div>

      {item.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-600 italic">
            "{item.notes}"
          </p>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between header-spacing">
        <div>
          <h1 className={`text-2xl font-bold ${getTitleColor()}`}>Lab Work</h1>
          <p className={`mt-1 ${isDynamicEnvironment && circadianState?.theme === 'night' ? 'text-white/80' : 'text-gray-600'}`}>Manage dental lab work orders and tracking</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center">
          <FiPlus className="w-4 h-4 mr-2" />
          New Lab Work
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding section-spacing">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search lab work..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="button-padding border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-spacing section-spacing">
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{labWork.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {labWork.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {labWork.filter(item => item.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 card-padding shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {labWork.filter(item => item.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Work Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-spacing">
        {filteredLabWork.map(item => (
          <LabWorkCard key={item.id} item={item} />
        ))}
      </div>

      {filteredLabWork.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lab work found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first lab work order'
            }
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            New Lab Work
          </button>
        </div>
      )}
    </div>
  );
};

export default LabWork; 