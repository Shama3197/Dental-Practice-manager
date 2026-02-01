import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PatientHistoryForm from '../components/Patients/PatientHistoryForm';
import { patientService } from '../services/patientService';

const NewPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await patientService.createPatient(formData);
      toast.success('Patient created successfully');
      navigate('/patients');
    } catch (error) {
      toast.error(error.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">New Patient Registration</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PatientHistoryForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default NewPatient; 