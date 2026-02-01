import React, { useState, useEffect } from 'react';
import ToothChart from '../Appointments/ToothChart'; // Assuming ToothChart is in this path

const MedicalRecord = ({ patientId }) => {
  // Dummy data for treated teeth and past treatments
  // In a real application, this data would be fetched from a backend service
  const dummyTreatedTeeth = [18, 21, 30, 48];
  const dummyMedicalTreatments = [
    {
      id: 1,
      date: '2023-04-15',
      type: 'filling',
      description: 'Tooth Filling (Caries)',
      doctor: 'Dr. Putri Larasati',
      clinic: 'Zendral Dental',
      status: 'Done',
      teeth: [18],
    },
    {
      id: 2,
      date: '2023-04-12',
      type: 'cleaning',
      description: 'Tooth Scaling',
      doctor: 'Dr. Sarah Iztafa',
      clinic: 'Zendral Dental',
      status: 'Pending',
      notes: 'Reason: Not enough time',
    },
  ];

  const [treatedTeeth, setTreatedTeeth] = useState(dummyTreatedTeeth);
  const [medicalTreatments, setMedicalTreatments] = useState(dummyMedicalTreatments);

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
    // In a real app, fetch medical record data based on patientId
    // For now, using dummy data
  }, [patientId]);

  return (
    <div className="medical-record-container p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Medical Record</h2>

      {/* Tooth Chart Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Dental Record</h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <ToothChart selectedTeeth={treatedTeeth} onToothSelect={() => {}} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Click on teeth to mark them as treated (for demonstration purposes).</p>
        </div>
      </div>

      {/* Treatment History Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Treatment History</h3>
        <div className="space-y-4">
          {medicalTreatments.length > 0 ? (
            medicalTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {treatment.description}
                    {treatment.teeth && treatment.teeth.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">({treatment.teeth.join(', ')})</span>
                    )}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${treatmentCategories[treatment.type]?.color || 'bg-gray-200 text-gray-800'}`}>
                    {treatmentCategories[treatment.type]?.name || treatment.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Date:</strong> {treatment.date}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Doctor:</strong> {treatment.doctor}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Clinic:</strong> {treatment.clinic}
                </p>
                {treatment.notes && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Notes:</strong> {treatment.notes}
                  </p>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong> {treatment.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No treatment history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord; 