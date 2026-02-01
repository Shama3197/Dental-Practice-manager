import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiTag,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import AddTreatmentModal from '../components/Treatments/AddTreatmentModal';

const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', color: 'bg-gray-100 text-gray-800' },
    { id: 'prostho', name: 'Prosthodontics', color: 'bg-blue-100 text-blue-800' },
    { id: 'ortho', name: 'Orthodontics', color: 'bg-green-100 text-green-800' },
    { id: 'endo', name: 'Endodontics', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'perio', name: 'Periodontics', color: 'bg-purple-100 text-purple-800' },
    { id: 'surgery', name: 'Oral Surgery', color: 'bg-red-100 text-red-800' },
    { id: 'hygiene', name: 'Hygiene', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'diagnostic', name: 'Diagnostic', color: 'bg-pink-100 text-pink-800' }
  ];

  useEffect(() => {
    // Simulate loading and fetch treatments data
    const loadData = async () => {
      try {
        // Mock treatments data
        const mockTreatments = [
          { id: 1, name: 'Crown', category: 'prostho', description: 'Dental crown restoration', price: 1200, duration: 90 },
          { id: 2, name: 'Bridge', category: 'prostho', description: 'Fixed dental bridge', price: 2500, duration: 120 },
          { id: 3, name: 'Braces', category: 'ortho', description: 'Orthodontic braces treatment', price: 5000, duration: 720 },
          { id: 4, name: 'Invisalign', category: 'ortho', description: 'Clear aligner treatment', price: 4000, duration: 540 },
          { id: 5, name: 'Root Canal', category: 'endo', description: 'Endodontic treatment', price: 1500, duration: 90 },
          { id: 6, name: 'Extraction', category: 'surgery', description: 'Tooth extraction', price: 300, duration: 45 },
          { id: 7, name: 'Deep Cleaning', category: 'hygiene', description: 'Scaling and root planing', price: 400, duration: 60 },
          { id: 8, name: 'X-Ray', category: 'diagnostic', description: 'Dental radiography', price: 150, duration: 15 },
          { id: 9, name: 'Implant', category: 'surgery', description: 'Dental implant placement', price: 3500, duration: 180 },
          { id: 10, name: 'Veneers', category: 'prostho', description: 'Porcelain veneers', price: 1800, duration: 120 },
          { id: 11, name: 'Gum Surgery', category: 'perio', description: 'Periodontal surgery', price: 800, duration: 90 },
          { id: 12, name: 'Whitening', category: 'hygiene', description: 'Teeth whitening treatment', price: 300, duration: 60 }
        ];

        // Mock treatment plans data
        const mockTreatmentPlans = [
          {
            id: 1,
            patientName: 'John Doe',
            patientId: 1,
            treatments: [
              { id: 1, name: 'Crown', status: 'completed', date: '2024-01-15', teeth: [14] },
              { id: 7, name: 'Deep Cleaning', status: 'in-progress', date: '2024-02-20', teeth: [1, 2, 3, 4] }
            ],
            totalCost: 1600,
            status: 'in-progress',
            startDate: '2024-01-15',
            estimatedCompletion: '2024-03-15'
          },
          {
            id: 2,
            patientName: 'Sarah Wilson',
            patientId: 2,
            treatments: [
              { id: 3, name: 'Braces', status: 'in-progress', date: '2024-01-01', teeth: [1, 2, 3, 4, 5, 6, 7, 8] },
              { id: 8, name: 'X-Ray', status: 'completed', date: '2024-01-01', teeth: [] }
            ],
            totalCost: 5150,
            status: 'in-progress',
            startDate: '2024-01-01',
            estimatedCompletion: '2024-12-31'
          },
          {
            id: 3,
            patientName: 'Mike Johnson',
            patientId: 3,
            treatments: [
              { id: 5, name: 'Root Canal', status: 'completed', date: '2024-02-10', teeth: [19] },
              { id: 1, name: 'Crown', status: 'planned', date: '2024-03-01', teeth: [19] }
            ],
            totalCost: 2700,
            status: 'in-progress',
            startDate: '2024-02-10',
            estimatedCompletion: '2024-03-15'
          }
        ];
        
        setTreatments(mockTreatments);
        setTreatmentPlans(mockTreatmentPlans);
        setFilteredTreatments(mockTreatments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading treatments:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter treatments based on search term and category
    let filtered = treatments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(treatment =>
        treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(treatment => treatment.category === selectedCategory);
    }

    setFilteredTreatments(filtered);
  }, [treatments, searchTerm, selectedCategory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <FiClock className="w-4 h-4" />;
      case 'planned':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

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

  const TreatmentCard = ({ treatment }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categories.find(c => c.id === treatment.category)?.color}`}>
          {categories.find(c => c.id === treatment.category)?.name}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(treatment.price)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium text-gray-900">{treatment.duration} minutes</span>
        </div>
      </div>
      
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

  const TreatmentPlanCard = ({ plan }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{plan.patientName}</h3>
            <p className="text-sm text-gray-500">Plan #{plan.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
          <div className="flex items-center space-x-1">
            {getStatusIcon(plan.status)}
            <span className="capitalize">{plan.status.replace('-', ' ')}</span>
          </div>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Cost:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(plan.totalCost)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Start Date:</span>
          <span className="font-medium text-gray-900">{formatDate(plan.startDate)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Estimated Completion:</span>
          <span className="font-medium text-gray-900">{formatDate(plan.estimatedCompletion)}</span>
        </div>
      </div>

      {/* Treatment List */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Treatments:</h4>
        <div className="space-y-2">
          {plan.treatments.map((treatment, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  treatment.status === 'completed' ? 'bg-green-500' :
                  treatment.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></span>
                <span className="text-sm font-medium">{treatment.name}</span>
                {treatment.teeth.length > 0 && (
                  <span className="text-xs text-gray-500 ml-2">(Teeth: {treatment.teeth.join(', ')})</span>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(treatment.status)}`}>
                {treatment.status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <FiEye className="w-4 h-4" />
        </button>
        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          <FiEdit className="w-4 h-4" />
        </button>
        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          <FiDownload className="w-4 h-4" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatments</h1>
          <p className="text-gray-600 mt-1">Manage dental treatments and treatment plans</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Treatment
        </button>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} border-2 border-current`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            {showFilters && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Treatments Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Treatments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first treatment'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Add First Treatment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Treatment Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {treatmentPlans.map(plan => (
            <TreatmentPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Empty State for Treatment Plans */}
        {treatmentPlans.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No treatment plans</h3>
            <p className="text-gray-500">Create treatment plans for your patients to track their dental care journey.</p>
          </div>
        )}
      </div>

      {/* Add Treatment Modal */}
      {showModal && (
        <AddTreatmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={(formData) => {
            console.log('New treatment:', formData);
            setShowModal(false);
            // Here you would typically save to backend and refresh the list
          }}
        />
      )}
    </div>
  );
};

export default Treatments; 