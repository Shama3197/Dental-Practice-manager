import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import NewAppointmentForm from '../components/Appointments/NewAppointmentForm';
import { appointmentService } from '../services/appointmentService';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';
import { getCircadianState } from '../utils/themeEngine';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    // Fetch appointments from API
    const loadAppointments = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        // Transform API data to match component structure
        const transformedAppointments = data.map(apt => ({
          id: apt._id,
          patientName: apt.patient?.name || 'Unknown Patient',
          patientPhone: apt.patient?.phone || '',
          date: apt.date ? new Date(apt.date).toISOString().split('T')[0] : '',
          time: apt.time || '',
          duration: 60, // Default duration
          status: apt.status?.toLowerCase() || 'scheduled',
          treatment: apt.treatmentDetails?.join(', ') || apt.treatmentType || 'Treatment',
          teeth: apt.selectedTeeth || [],
          notes: apt.caseNotes || '',
          insurance: apt.patient?.insurance || ''
        }));
        setAppointments(transformedAppointments);
        setFilteredAppointments(transformedAppointments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleAppointmentCreated = () => {
    // Refresh appointments list
    const loadAppointments = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        const transformedAppointments = data.map(apt => ({
          id: apt._id,
          patientName: apt.patient?.name || 'Unknown Patient',
          patientPhone: apt.patient?.phone || '',
          date: apt.date ? new Date(apt.date).toISOString().split('T')[0] : '',
          time: apt.time || '',
          duration: 60,
          status: apt.status?.toLowerCase() || 'scheduled',
          treatment: apt.treatmentDetails?.join(', ') || apt.treatmentType || 'Treatment',
          teeth: apt.selectedTeeth || [],
          notes: apt.caseNotes || '',
          insurance: apt.patient?.insurance || ''
        }));
        setAppointments(transformedAppointments);
        setFilteredAppointments(transformedAppointments);
        // Trigger refresh event for DailyTasker
        window.dispatchEvent(new CustomEvent('appointmentCreated'));
      } catch (error) {
        console.error('Error refreshing appointments:', error);
      }
    };
    loadAppointments();
  };

  useEffect(() => {
    // Filter appointments based on search term, status, and date
    let filtered = appointments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus);
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(appointment => appointment.date === selectedDate);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, selectedStatus, selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <FiClock className="w-4 h-4" />;
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      case 'no-show':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    const upcomingAppointments = appointments.filter(apt => apt.date > today && apt.status === 'scheduled');
    
    return {
      totalToday: todayAppointments.length,
      upcoming: upcomingAppointments.length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length
    };
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-500">{appointment.treatment}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(appointment.status)}
              <span className="capitalize">{appointment.status}</span>
            </div>
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(appointment.date)} at {formatTime(appointment.time)}</span>
          <span className="ml-2 text-gray-400">({appointment.duration} min)</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiPhone className="w-4 h-4 mr-2" />
          <span>{appointment.patientPhone}</span>
        </div>
        {appointment.teeth.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>Teeth: {appointment.teeth.join(', ')}</span>
          </div>
        )}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Insurance:</span> {appointment.insurance}
        </div>
      </div>

      {appointment.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
        </div>
      )}
      
      <div className="flex items-center justify-end space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <FiEdit className="w-4 h-4" />
        </button>
        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const stats = getStats();

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
          <h1 className={`text-2xl font-bold ${getTitleColor()}`}>Appointments</h1>
          <p className={`mt-1 ${isDynamicEnvironment && circadianState?.theme === 'night' ? 'text-white/80' : 'text-gray-600'}`}>Manage patient appointments and scheduling</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search appointments by patient or treatment..."
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
              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
                
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiXCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedStatus !== 'all' || selectedDate
              ? 'Try adjusting your search or filters'
              : 'Get started by scheduling your first appointment'
            }
          </p>
          {!searchTerm && selectedStatus === 'all' && !selectedDate && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Schedule First Appointment
            </button>
          )}
        </div>
      )}

      {/* Appointment Form Modal */}
      {showModal && (
        <NewAppointmentForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}
    </div>
  );
};

export default Appointments; 