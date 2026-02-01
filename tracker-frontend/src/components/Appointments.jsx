import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiPhone,
  FiEdit,
  FiTrash2,
  FiEye
} from 'react-icons/fi';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Simulate loading and fetch appointments data
    const loadAppointments = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockAppointments = [
          {
            id: 1,
            patientName: 'John Doe',
            patientEmail: 'john.doe@email.com',
            patientPhone: '(555) 123-4567',
            date: '2024-02-20',
            time: '09:00',
            duration: 60,
            type: 'Cleaning',
            status: 'confirmed',
            notes: 'Regular cleaning appointment',
            address: '123 Main St, City, State'
          },
          {
            id: 2,
            patientName: 'Sarah Wilson',
            patientEmail: 'sarah.wilson@email.com',
            patientPhone: '(555) 234-5678',
            date: '2024-02-20',
            time: '10:30',
            duration: 90,
            type: 'Crown',
            status: 'confirmed',
            notes: 'Crown placement - follow up',
            address: '456 Oak Ave, City, State'
          },
          {
            id: 3,
            patientName: 'Mike Johnson',
            patientEmail: 'mike.johnson@email.com',
            patientPhone: '(555) 345-6789',
            date: '2024-02-21',
            time: '14:00',
            duration: 45,
            type: 'Checkup',
            status: 'pending',
            notes: 'Annual checkup',
            address: '789 Pine Rd, City, State'
          },
          {
            id: 4,
            patientName: 'Emily Davis',
            patientEmail: 'emily.davis@email.com',
            patientPhone: '(555) 456-7890',
            date: '2024-02-21',
            time: '15:30',
            duration: 120,
            type: 'Root Canal',
            status: 'confirmed',
            notes: 'Root canal treatment',
            address: '321 Elm St, City, State'
          },
          {
            id: 5,
            patientName: 'Robert Brown',
            patientEmail: 'robert.brown@email.com',
            patientPhone: '(555) 567-8901',
            date: '2024-02-22',
            time: '11:00',
            duration: 60,
            type: 'Cleaning',
            status: 'cancelled',
            notes: 'Patient requested cancellation',
            address: '654 Maple Dr, City, State'
          }
        ];
        
        setAppointments(mockAppointments);
        setFilteredAppointments(mockAppointments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments based on search term, selected filter, and date
    let filtered = appointments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedFilter);
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(appointment => appointment.date === selectedDate);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, selectedFilter, selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'cleaning':
        return 'bg-blue-100 text-blue-800';
      case 'crown':
        return 'bg-purple-100 text-purple-800';
      case 'checkup':
        return 'bg-green-100 text-green-800';
      case 'root canal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
            {appointment.type}
          </span>
        </div>
      </div>

      <div className="list-spacing mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="w-4 h-4 mr-2" />
          <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiPhone className="w-4 h-4 mr-2" />
          <span>{appointment.patientPhone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{appointment.address}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-600 italic">
            "{appointment.notes}"
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your patient appointments and schedule</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center">
          <FiPlus className="w-4 h-4 mr-2" />
          New Appointment
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
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="button-padding border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="button-padding border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-spacing section-spacing">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 card-padding">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-spacing">
        {filteredAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedFilter !== 'all' || selectedDate
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by scheduling your first appointment'
            }
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white button-padding rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            New Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default Appointments; 