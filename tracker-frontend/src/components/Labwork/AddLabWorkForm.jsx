import React, { useState, useEffect } from 'react';
import { addLabWork } from '../../api/labwork';
import axios from 'axios';
import { toast } from 'react-toastify';

const caseTypes = ['Crown', 'Denture', 'Bridge', 'Veneer', 'Implant', 'Inlay', 'Onlay', 'Partial', 'Other'];
const statusOptions = ['Pending', 'In Progress', 'Received', 'Delayed', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

const AddLabWorkForm = ({ onSuccess }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    caseType: '',
    dateSent: '',
    expectedReturnDate: '',
    status: 'Pending',
    priority: 'Medium',
    notes: '',
    labInstructions: '',
    labName: '',
    labContact: '',
    cost: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.patientId || !form.caseType || !form.dateSent) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const formData = {
        ...form,
        cost: form.cost ? parseFloat(form.cost) : 0
      };

      await addLabWork(formData);
      toast.success('Lab work entry created successfully');
      
      setForm({
        patientId: '',
        caseType: '',
        dateSent: '',
        expectedReturnDate: '',
        status: 'Pending',
        priority: 'Medium',
        notes: '',
        labInstructions: '',
        labName: '',
        labContact: '',
        cost: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating labwork:', error);
      toast.error(error.response?.data?.error || 'Failed to create lab work entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-6 bg-white rounded-xl shadow space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Add Lab Work</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">Patient *</label>
          <select 
            className="w-full border rounded p-3" 
            value={form.patientId} 
            onChange={e => handleInputChange('patientId', e.target.value)} 
            required
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} - {p.contactNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Case Type *</label>
          <select 
            className="w-full border rounded p-3" 
            value={form.caseType} 
            onChange={e => handleInputChange('caseType', e.target.value)} 
            required
          >
            <option value="">Select Case Type</option>
            {caseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Date Sent *</label>
          <input 
            type="date" 
            className="w-full border rounded p-3" 
            value={form.dateSent} 
            onChange={e => handleInputChange('dateSent', e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Expected Return Date</label>
          <input 
            type="date" 
            className="w-full border rounded p-3" 
            value={form.expectedReturnDate} 
            onChange={e => handleInputChange('expectedReturnDate', e.target.value)} 
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Status</label>
          <select 
            className="w-full border rounded p-3" 
            value={form.status} 
            onChange={e => handleInputChange('status', e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Priority</label>
          <select 
            className="w-full border rounded p-3" 
            value={form.priority} 
            onChange={e => handleInputChange('priority', e.target.value)}
          >
            {priorityOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Lab Name</label>
          <input 
            type="text" 
            className="w-full border rounded p-3" 
            value={form.labName} 
            onChange={e => handleInputChange('labName', e.target.value)} 
            placeholder="Enter lab name"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Cost ($)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full border rounded p-3" 
            value={form.cost} 
            onChange={e => handleInputChange('cost', e.target.value)} 
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Lab Instructions</label>
        <textarea 
          className="w-full border rounded p-3" 
          value={form.labInstructions} 
          onChange={e => handleInputChange('labInstructions', e.target.value)} 
          rows="3"
          placeholder="Enter specific instructions for the lab..."
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Notes</label>
        <textarea 
          className="w-full border rounded p-3" 
          value={form.notes} 
          onChange={e => handleInputChange('notes', e.target.value)} 
          rows="3"
          placeholder="Enter any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          type="button" 
          onClick={() => onSuccess && onSuccess()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Lab Work'}
        </button>
      </div>
    </form>
  );
};

export default AddLabWorkForm; 