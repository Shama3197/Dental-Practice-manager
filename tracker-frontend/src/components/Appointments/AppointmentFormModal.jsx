import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiMapPin,
  FiTag,
  FiFileText,
  FiCheck
} from 'react-icons/fi';

const AppointmentFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: 60,
    treatment: '',
    teeth: [],
    notes: '',
    insurance: ''
  });

  const [patients, setPatients] = useState([]);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);

  // Mock data - replace with actual API calls
  const mockPatients = [
    { id: 1, name: 'John Doe', phone: '(555) 123-4567', insurance: 'Blue Cross' },
    { id: 2, name: 'Sarah Wilson', phone: '(555) 234-5678', insurance: 'Aetna' },
    { id: 3, name: 'Mike Johnson', phone: '(555) 345-6789', insurance: 'Cigna' },
    { id: 4, name: 'Emily Davis', phone: '(555) 456-7890', insurance: 'United Health' },
    { id: 5, name: 'Robert Brown', phone: '(555) 567-8901', insurance: 'Blue Cross' }
  ];

  const treatments = [
    { id: 1, name: 'Regular Cleaning', category: 'Hygiene', color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Deep Cleaning', category: 'Hygiene', color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'Filling', category: 'Restorative', color: 'bg-green-100 text-green-800' },
    { id: 4, name: 'Crown', category: 'Restorative', color: 'bg-green-100 text-green-800' },
    { id: 5, name: 'Root Canal', category: 'Endodontics', color: 'bg-yellow-100 text-yellow-800' },
    { id: 6, name: 'Extraction', category: 'Surgery', color: 'bg-red-100 text-red-800' },
    { id: 7, name: 'Consultation', category: 'General', color: 'bg-purple-100 text-purple-800' },
    { id: 8, name: 'X-Ray', category: 'Diagnostic', color: 'bg-gray-100 text-gray-800' }
  ];

  const toothNumbers = Array.from({ length: 32 }, (_, i) => i + 1);

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToothToggle = (toothNumber) => {
    setSelectedTeeth(prev => 
      prev.includes(toothNumber)
        ? prev.filter(t => t !== toothNumber)
        : [...prev, toothNumber]
    );
  };

  const handleTreatmentToggle = (treatment) => {
    setSelectedTreatments(prev => 
      prev.find(t => t.id === treatment.id)
        ? prev.filter(t => t.id !== treatment.id)
        : [...prev, treatment]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      teeth: selectedTeeth,
      treatments: selectedTreatments
    };
    onSubmit(submitData);
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === parseInt(formData.patientId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="w-4 h-4 inline mr-2" />
              Patient
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.phone}
                </option>
              ))}
            </select>
            {getSelectedPatient() && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Insurance:</span> {getSelectedPatient().insurance}
                </p>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="w-4 h-4 inline mr-2" />
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Tooth Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiMapPin className="w-4 h-4 inline mr-2" />
              Teeth (FDI System)
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-16 gap-1 mb-2">
                {/* Upper teeth (1-16) */}
                {toothNumbers.slice(0, 16).map(tooth => (
                  <button
                    key={tooth}
                    type="button"
                    onClick={() => handleToothToggle(tooth)}
                    className={`w-8 h-8 text-xs font-medium rounded border transition-colors ${
                      selectedTeeth.includes(tooth)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tooth}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-16 gap-1">
                {/* Lower teeth (17-32) */}
                {toothNumbers.slice(16).map(tooth => (
                  <button
                    key={tooth}
                    type="button"
                    onClick={() => handleToothToggle(tooth)}
                    className={`w-8 h-8 text-xs font-medium rounded border transition-colors ${
                      selectedTeeth.includes(tooth)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tooth}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upper teeth: 1-16, Lower teeth: 17-32
              </p>
            </div>
          </div>

          {/* Treatment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiTag className="w-4 h-4 inline mr-2" />
              Treatments
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {treatments.map(treatment => (
                  <button
                    key={treatment.id}
                    type="button"
                    onClick={() => handleTreatmentToggle(treatment)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedTreatments.find(t => t.id === treatment.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${treatment.color}`}>
                        {treatment.category}
                      </span>
                      <span className="ml-2 text-sm font-medium">{treatment.name}</span>
                    </div>
                    {selectedTreatments.find(t => t.id === treatment.id) && (
                      <FiCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="w-4 h-4 inline mr-2" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about the appointment..."
            />
          </div>

          {/* Selected Summary */}
          {(selectedTeeth.length > 0 || selectedTreatments.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Appointment Summary</h4>
              {selectedTeeth.length > 0 && (
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">Teeth:</span> {selectedTeeth.sort((a, b) => a - b).join(', ')}
                </p>
              )}
              {selectedTreatments.length > 0 && (
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Treatments:</span> {selectedTreatments.map(t => t.name).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentFormModal; 