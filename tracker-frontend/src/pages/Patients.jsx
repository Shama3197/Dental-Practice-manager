import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiEdit, 
  FiEye, 
  FiTrash2,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiTag
} from 'react-icons/fi';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading and fetch patients data
    const loadPatients = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockPatients = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            dateOfBirth: '1985-03-15',
            address: '123 Main St, City, State',
            status: 'active',
            lastVisit: '2024-01-15',
            nextAppointment: '2024-02-20',
            insurance: 'Blue Cross',
            notes: 'Regular checkup patient'
          },
          {
            id: 2,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com',
            phone: '(555) 234-5678',
            dateOfBirth: '1990-07-22',
            address: '456 Oak Ave, City, State',
            status: 'active',
            lastVisit: '2024-01-10',
            nextAppointment: null,
            insurance: 'Aetna',
            notes: 'Requires follow-up for crown'
          },
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@email.com',
            phone: '(555) 345-6789',
            dateOfBirth: '1978-11-08',
            address: '789 Pine Rd, City, State',
            status: 'inactive',
            lastVisit: '2023-12-05',
            nextAppointment: null,
            insurance: 'Cigna',
            notes: 'Moved to different city'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '(555) 456-7890',
            dateOfBirth: '1995-04-12',
            address: '321 Elm St, City, State',
            status: 'active',
            lastVisit: '2024-01-20',
            nextAppointment: '2024-02-25',
            insurance: 'United Health',
            notes: 'New patient, first visit completed'
          },
          {
            id: 5,
            name: 'Robert Brown',
            email: 'robert.brown@email.com',
            phone: '(555) 567-8901',
            dateOfBirth: '1982-09-30',
            address: '654 Maple Dr, City, State',
            status: 'active',
            lastVisit: '2024-01-18',
            nextAppointment: '2024-02-22',
            insurance: 'Blue Cross',
            notes: 'Regular cleaning and checkup'
          }
        ];
        
        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading patients:', error);
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term and selected filter
    let filtered = patients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === selectedFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, selectedFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const PatientCard = ({ patient }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
        </div>
      </div>

      <div className="list-spacing mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiMail className="w-4 h-4 mr-2" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiPhone className="w-4 h-4 mr-2" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>DOB: {formatDate(patient.dateOfBirth)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{patient.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiTag className="w-4 h-4 mr-2" />
          <span>{patient.insurance}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Last Visit:</span>
          <span className="font-medium">{formatDate(patient.lastVisit)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-500">Next Appointment:</span>
          <span className="font-medium">{formatDate(patient.nextAppointment)}</span>
        </div>
        
        {patient.notes && (
          <p className="text-xs text-gray-500 italic truncate flex-1 mr-2">
            "{patient.notes}"
          </p>
        )}
        
        <div className="flex items-center justify-end space-x-2 mt-4">
          <button 
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
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
    <div className="section-spacing">
      {/* Header */}
      <div className="flex items-center justify-between header-spacing">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage your patient records and information</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center">
          <FiPlus className="w-4 h-4 mr-2" />
          Add Patient
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
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center button-padding border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="button-padding border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-spacing section-spacing">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUser className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => {
                  const lastVisit = new Date(p.lastVisit);
                  const now = new Date();
                  return lastVisit.getMonth() === now.getMonth() && 
                         lastVisit.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.nextAppointment).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-spacing">
        {filteredPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first patient'
            }
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            Add Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default Patients; 