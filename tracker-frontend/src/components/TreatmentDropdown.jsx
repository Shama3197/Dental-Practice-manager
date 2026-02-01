import React from 'react';

const treatments = [
  { id: 'exam', name: 'Dental Examination' },
  { id: 'cleaning', name: 'Professional Cleaning' },
  { id: 'filling', name: 'Dental Filling' },
  { id: 'root_canal', name: 'Root Canal Treatment' },
  { id: 'extraction', name: 'Tooth Extraction' },
  { id: 'crown', name: 'Dental Crown' },
  { id: 'bridge', name: 'Dental Bridge' },
  { id: 'implant', name: 'Dental Implant' },
  { id: 'whitening', name: 'Teeth Whitening' },
  { id: 'ortho', name: 'Orthodontic Treatment' },
  { id: 'other', name: 'Other Treatment' }
];

const TreatmentDropdown = ({ value, onChange, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
    >
      <option value="">Select Treatment</option>
      {treatments.map((treatment) => (
        <option key={treatment.id} value={treatment.id}>
          {treatment.name}
        </option>
      ))}
    </select>
  );
};

export default TreatmentDropdown; 