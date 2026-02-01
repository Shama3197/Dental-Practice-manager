import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiUser, 
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiFileText,
  FiCheck
} from 'react-icons/fi';

const AddEarningModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    treatment: '',
    amount: '',
    date: '',
    paymentMethod: 'cash',
    status: 'paid',
    notes: ''
  });

  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // Mock data - replace with actual API calls
  const mockPatients = [
    { id: 1, name: 'John Doe', phone: '(555) 123-4567' },
    { id: 2, name: 'Sarah Wilson', phone: '(555) 234-5678' },
    { id: 3, name: 'Mike Johnson', phone: '(555) 345-6789' },
    { id: 4, name: 'Emily Davis', phone: '(555) 456-7890' },
    { id: 5, name: 'Robert Brown', phone: '(555) 567-8901' }
  ];

  const mockTreatments = [
    { id: 1, name: 'Crown', price: 1200 },
    { id: 2, name: 'Bridge', price: 2500 },
    { id: 3, name: 'Braces', price: 5000 },
    { id: 4, name: 'Invisalign', price: 4000 },
    { id: 5, name: 'Root Canal', price: 1500 },
    { id: 6, name: 'Extraction', price: 300 },
    { id: 7, name: 'Deep Cleaning', price: 400 },
    { id: 8, name: 'X-Ray', price: 150 },
    { id: 9, name: 'Implant', price: 3500 },
    { id: 10, name: 'Veneers', price: 1800 },
    { id: 11, name: 'Gum Surgery', price: 800 },
    { id: 12, name: 'Whitening', price: 300 },
    { id: 13, name: 'Consultation', price: 150 },
    { id: 14, name: 'Filling', price: 300 }
  ];

  useEffect(() => {
    setPatients(mockPatients);
    setTreatments(mockTreatments);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill amount when treatment is selected
    if (field === 'treatment') {
      const selectedTreatment = treatments.find(t => t.name === value);
      if (selectedTreatment) {
        setFormData(prev => ({
          ...prev,
          amount: selectedTreatment.price.toString()
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === parseInt(formData.patientId));
  };

  const getSelectedTreatment = () => {
    return treatments.find(t => t.name === formData.treatment);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Earning</h2>
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

          {/* Treatment and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTag className="w-4 h-4 inline mr-2" />
                Treatment
              </label>
              <select
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select treatment</option>
                {treatments.map(treatment => (
                  <option key={treatment.id} value={treatment.name}>
                    {treatment.name} - {formatCurrency(treatment.price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="w-4 h-4 inline mr-2" />
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Date and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="insurance">Insurance</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial Payment</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
              placeholder="Additional notes about the payment..."
            />
          </div>

          {/* Summary */}
          {(formData.patientId || formData.treatment || formData.amount) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Payment Summary</h4>
              {getSelectedPatient() && (
                <p className="text-sm text-green-700 mb-1">
                  <span className="font-medium">Patient:</span> {getSelectedPatient().name}
                </p>
              )}
              {getSelectedTreatment() && (
                <p className="text-sm text-green-700 mb-1">
                  <span className="font-medium">Treatment:</span> {getSelectedTreatment().name}
                </p>
              )}
              {formData.amount && (
                <p className="text-sm text-green-700 mb-1">
                  <span className="font-medium">Amount:</span> {formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
              )}
              {formData.date && (
                <p className="text-sm text-green-700">
                  <span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString()}
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
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center"
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Add Earning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEarningModal; 