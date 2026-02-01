import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUserPlus } from 'react-icons/fi';
import { appointmentService } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import ToothChartFDI from "../ToothChartFDI";
import { patientService } from '../../services/patientService';

const NewAppointmentForm = ({ isOpen, onClose, onAppointmentCreated }) => {
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    status: 'Scheduled',
    treatmentDetails: [],
    caseNotes: '',
    selectedTeeth: []
  });
  const [patients, setPatients] = useState([]);

  const treatmentCategories = {
    "cleaning": { name: "Dental Cleaning", color: "bg-green-200 text-green-800" },
    "filling": { name: "Filling", color: "bg-blue-200 text-blue-800" },
    "extraction": { name: "Extraction", color: "bg-red-200 text-red-800" },
    "root-canal": { name: "Root Canal", color: "bg-purple-200 text-purple-800" },
    "checkup": { name: "Check-up", color: "bg-yellow-200 text-yellow-800" },
    "orthodontic": { name: "Orthodontic Treatment", color: "bg-indigo-200 text-indigo-800" },
    "whitening": { name: "Teeth Whitening", color: "bg-pink-200 text-pink-800" },
    "crown": { name: "Crown Placement", color: "bg-teal-200 text-teal-800" },
  };

  useEffect(() => {
    patientService.getAllPatients().then(setPatients).catch(() => setPatients([]));
  }, []);

  const handleToothSelect = (teeth) => {
    setFormData({ ...formData, selectedTeeth: teeth });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await appointmentService.createAppointment(formData);
      onAppointmentCreated();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">New Appointment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Patient Selection Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setIsNewPatient(false);
                setFormData({ ...formData, patientId: '', selectedTeeth: [] });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg
                ${!isNewPatient ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <FiSearch className="w-5 h-5" />
              <span>Existing Patient</span>
            </button>
            <button
              onClick={() => {
                setIsNewPatient(true);
                onClose();
                navigate('/patients/new');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg
                ${isNewPatient ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <FiUserPlus className="w-5 h-5" />
              <span>New Patient</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            {!isNewPatient && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Treatment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(treatmentCategories).map(([key, treatment]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${formData.treatmentDetails.includes(treatment.name)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.treatmentDetails.includes(treatment.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            treatmentDetails: [...formData.treatmentDetails, treatment.name]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            treatmentDetails: formData.treatmentDetails.filter(t => t !== treatment.name)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{treatment.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tooth Chart */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected Teeth
              </label>
              <div className="border rounded-lg p-4">
                <ToothChartFDI
                  selectedTeeth={formData.selectedTeeth}
                  onTeethChange={(teeth) => setFormData({ ...formData, selectedTeeth: teeth })}
                />
              </div>
            </div>

            {/* Case Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Notes
              </label>
              <textarea
                value={formData.caseNotes}
                onChange={(e) => setFormData({ ...formData, caseNotes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentForm; 