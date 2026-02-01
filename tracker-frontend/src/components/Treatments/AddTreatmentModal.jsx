import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiUser, 
  FiTag,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiUpload,
  FiCheck
} from 'react-icons/fi';

const AddTreatmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    treatmentName: '',
    category: '',
    status: 'planned',
    teeth: [],
    notes: '',
    estimatedCost: '',
    estimatedDuration: 60,
    startDate: '',
    priority: 'medium'
  });

  const [patients, setPatients] = useState([]);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Mock data - replace with actual API calls
  const mockPatients = [
    { id: 1, name: 'John Doe', phone: '(555) 123-4567' },
    { id: 2, name: 'Sarah Wilson', phone: '(555) 234-5678' },
    { id: 3, name: 'Mike Johnson', phone: '(555) 345-6789' },
    { id: 4, name: 'Emily Davis', phone: '(555) 456-7890' },
    { id: 5, name: 'Robert Brown', phone: '(555) 567-8901' }
  ];

  const treatmentCategories = [
    { id: 'prostho', name: 'Prosthodontics', color: 'bg-blue-100 text-blue-800' },
    { id: 'ortho', name: 'Orthodontics', color: 'bg-green-100 text-green-800' },
    { id: 'endo', name: 'Endodontics', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'perio', name: 'Periodontics', color: 'bg-purple-100 text-purple-800' },
    { id: 'surgery', name: 'Oral Surgery', color: 'bg-red-100 text-red-800' },
    { id: 'hygiene', name: 'Hygiene', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'diagnostic', name: 'Diagnostic', color: 'bg-pink-100 text-pink-800' }
  ];

  const treatmentNames = [
    { id: 1, name: 'Crown', category: 'prostho', price: 1200 },
    { id: 2, name: 'Bridge', category: 'prostho', price: 2500 },
    { id: 3, name: 'Braces', category: 'ortho', price: 5000 },
    { id: 4, name: 'Invisalign', category: 'ortho', price: 4000 },
    { id: 5, name: 'Root Canal', category: 'endo', price: 1500 },
    { id: 6, name: 'Extraction', category: 'surgery', price: 300 },
    { id: 7, name: 'Deep Cleaning', category: 'hygiene', price: 400 },
    { id: 8, name: 'X-Ray', category: 'diagnostic', price: 150 },
    { id: 9, name: 'Implant', category: 'surgery', price: 3500 },
    { id: 10, name: 'Veneers', category: 'prostho', price: 1800 },
    { id: 11, name: 'Gum Surgery', category: 'perio', price: 800 },
    { id: 12, name: 'Whitening', category: 'hygiene', price: 300 }
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

    // Auto-fill category and estimated cost when treatment name is selected
    if (field === 'treatmentName') {
      const selectedTreatment = treatmentNames.find(t => t.name === value);
      if (selectedTreatment) {
        setFormData(prev => ({
          ...prev,
          category: selectedTreatment.category,
          estimatedCost: selectedTreatment.price.toString()
        }));
      }
    }
  };

  const handleToothToggle = (toothNumber) => {
    setSelectedTeeth(prev => 
      prev.includes(toothNumber)
        ? prev.filter(t => t !== toothNumber)
        : [...prev, toothNumber]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      teeth: selectedTeeth,
      image: uploadedImage
    };
    onSubmit(submitData);
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === parseInt(formData.patientId));
  };

  const getFilteredTreatments = () => {
    if (!formData.category) return treatmentNames;
    return treatmentNames.filter(t => t.category === formData.category);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Treatment</h2>
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
                  <span className="font-medium">Patient:</span> {getSelectedPatient().name}
                </p>
              </div>
            )}
          </div>

          {/* Treatment Category and Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTag className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {treatmentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Name
              </label>
              <select
                value={formData.treatmentName}
                onChange={(e) => handleInputChange('treatmentName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select treatment</option>
                {getFilteredTreatments().map(treatment => (
                  <option key={treatment.id} value={treatment.name}>
                    {treatment.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Cost and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="w-4 h-4 inline mr-2" />
                Estimated Cost
              </label>
              <input
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="w-4 h-4 inline mr-2" />
                Estimated Duration (minutes)
              </label>
              <select
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tooth Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUpload className="w-4 h-4 inline mr-2" />
              Upload Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {uploadedImage && (
              <div className="mt-2">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
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
              placeholder="Additional notes about the treatment..."
            />
          </div>

          {/* Selected Summary */}
          {(selectedTeeth.length > 0 || formData.treatmentName) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Treatment Summary</h4>
              {formData.treatmentName && (
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">Treatment:</span> {formData.treatmentName}
                </p>
              )}
              {formData.category && (
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">Category:</span> {treatmentCategories.find(c => c.id === formData.category)?.name}
                </p>
              )}
              {selectedTeeth.length > 0 && (
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">Teeth:</span> {selectedTeeth.sort((a, b) => a - b).join(', ')}
                </p>
              )}
              {formData.estimatedCost && (
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Estimated Cost:</span> ${formData.estimatedCost}
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
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center"
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Add Treatment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreatmentModal; 