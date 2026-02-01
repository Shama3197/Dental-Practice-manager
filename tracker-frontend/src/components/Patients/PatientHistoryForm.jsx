import { useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import FileUpload from './FileUpload';

const PatientHistoryForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: initialData.name || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || '',
    contactNumber: initialData.contactNumber || '',
    email: initialData.email || '',
    address: initialData.address || '',
    notes: initialData.notes || '',
    emergencyContact: initialData.emergencyContact || {
      name: '',
      relationship: '',
      phone: '',
    },

    // Medical History
    medicalHistory: {
      conditions: initialData.medicalHistory?.conditions || [],
      hospitalizations: initialData.medicalHistory?.hospitalizations || [],
      surgeries: initialData.medicalHistory?.surgeries || [],
    },

    // Medications
    medications: initialData.medications || [],

    // Allergies
    allergies: initialData.allergies || [],

    // Dental History
    dentalHistory: {
      lastDentalVisit: initialData.dentalHistory?.lastDentalVisit || '',
      previousTreatments: initialData.dentalHistory?.previousTreatments || [],
      orthodonticHistory: initialData.dentalHistory?.orthodonticHistory || {
        hasHadBraces: false,
        startDate: '',
        endDate: '',
        notes: '',
      },
      habits: initialData.dentalHistory?.habits || {
        bruxism: false,
        nailBiting: false,
        smoking: false,
        alcohol: false,
        notes: '',
      },
    },

    // Vitals
    vitals: initialData.vitals || {
      height: '',
      weight: '',
      bloodPressure: {
        systolic: '',
        diastolic: '',
        lastUpdated: '',
      },
      heartRate: {
        value: '',
        lastUpdated: '',
      },
      temperature: {
        value: '',
        lastUpdated: '',
      },
    },

    // Insurance Information
    insurance: initialData.insurance || {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      coverageDetails: '',
    },

    // Files
    files: initialData.files || [],
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayItemAdd = (section, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  const handleArrayItemRemove = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const dummyConditions = ['Diabetes', 'Hypertension', 'Asthma'];
  const dummyMedications = ['Metformin', 'Lisinopril', 'Albuterol'];
  const dummyAllergies = ['Penicillin', 'Latex', 'Peanuts'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Add any additional notes about the patient..."
              rows="3"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Relationship</label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Medical History Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Medical History</h2>
        
        {/* Medical Conditions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Medical Conditions</h3>
            <button
              type="button"
              onClick={() => handleArrayItemAdd('medicalHistory.conditions', {
                name: '',
                diagnosedDate: '',
                status: '',
                notes: '',
              })}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <FiPlus /> Add Condition
            </button>
          </div>
          {formData.medicalHistory.conditions.map((condition, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <input
                  type="text"
                  value={condition.name}
                  onChange={(e) => {
                    const newConditions = [...formData.medicalHistory.conditions];
                    newConditions[index].name = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, conditions: newConditions }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosed Date</label>
                <input
                  type="date"
                  value={condition.diagnosedDate}
                  onChange={(e) => {
                    const newConditions = [...formData.medicalHistory.conditions];
                    newConditions[index].diagnosedDate = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, conditions: newConditions }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={condition.status}
                  onChange={(e) => {
                    const newConditions = [...formData.medicalHistory.conditions];
                    newConditions[index].status = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, conditions: newConditions }
                    });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Chronic">Chronic</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    type="text"
                    value={condition.notes}
                    onChange={(e) => {
                      const newConditions = [...formData.medicalHistory.conditions];
                      newConditions[index].notes = e.target.value;
                      setFormData({
                        ...formData,
                        medicalHistory: { ...formData.medicalHistory, conditions: newConditions }
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove('medicalHistory.conditions', index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hospitalizations */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Hospitalizations</h3>
            <button
              type="button"
              onClick={() => handleArrayItemAdd('medicalHistory.hospitalizations', {
                reason: '',
                date: '',
                duration: '',
                notes: '',
              })}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <FiPlus /> Add Hospitalization
            </button>
          </div>
          {formData.medicalHistory.hospitalizations.map((hospitalization, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input
                  type="text"
                  value={hospitalization.reason}
                  onChange={(e) => {
                    const newHospitalizations = [...formData.medicalHistory.hospitalizations];
                    newHospitalizations[index].reason = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, hospitalizations: newHospitalizations }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={hospitalization.date}
                  onChange={(e) => {
                    const newHospitalizations = [...formData.medicalHistory.hospitalizations];
                    newHospitalizations[index].date = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, hospitalizations: newHospitalizations }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={hospitalization.duration}
                  onChange={(e) => {
                    const newHospitalizations = [...formData.medicalHistory.hospitalizations];
                    newHospitalizations[index].duration = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, hospitalizations: newHospitalizations }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    type="text"
                    value={hospitalization.notes}
                    onChange={(e) => {
                      const newHospitalizations = [...formData.medicalHistory.hospitalizations];
                      newHospitalizations[index].notes = e.target.value;
                      setFormData({
                        ...formData,
                        medicalHistory: { ...formData.medicalHistory, hospitalizations: newHospitalizations }
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove('medicalHistory.hospitalizations', index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Surgeries */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Surgeries</h3>
            <button
              type="button"
              onClick={() => handleArrayItemAdd('medicalHistory.surgeries', {
                procedure: '',
                date: '',
                notes: '',
              })}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <FiPlus /> Add Surgery
            </button>
          </div>
          {formData.medicalHistory.surgeries.map((surgery, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Procedure</label>
                <input
                  type="text"
                  value={surgery.procedure}
                  onChange={(e) => {
                    const newSurgeries = [...formData.medicalHistory.surgeries];
                    newSurgeries[index].procedure = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, surgeries: newSurgeries }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={surgery.date}
                  onChange={(e) => {
                    const newSurgeries = [...formData.medicalHistory.surgeries];
                    newSurgeries[index].date = e.target.value;
                    setFormData({
                      ...formData,
                      medicalHistory: { ...formData.medicalHistory, surgeries: newSurgeries }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    type="text"
                    value={surgery.notes}
                    onChange={(e) => {
                      const newSurgeries = [...formData.medicalHistory.surgeries];
                      newSurgeries[index].notes = e.target.value;
                      setFormData({
                        ...formData,
                        medicalHistory: { ...formData.medicalHistory, surgeries: newSurgeries }
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove('medicalHistory.surgeries', index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medications Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Medications</h2>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Current Medications</h3>
          <button
            type="button"
            onClick={() => handleArrayItemAdd('medications', {
              name: '',
              dosage: '',
              frequency: '',
              startDate: '',
              endDate: '',
              prescribedBy: '',
              notes: '',
            })}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <FiPlus /> Add Medication
          </button>
        </div>
        {formData.medications.map((medication, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name</label>
              <input
                type="text"
                value={medication.name}
                onChange={(e) => {
                  const newMedications = [...formData.medications];
                  newMedications[index].name = e.target.value;
                  setFormData({ ...formData, medications: newMedications });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input
                type="text"
                value={medication.dosage}
                onChange={(e) => {
                  const newMedications = [...formData.medications];
                  newMedications[index].dosage = e.target.value;
                  setFormData({ ...formData, medications: newMedications });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <input
                type="text"
                value={medication.frequency}
                onChange={(e) => {
                  const newMedications = [...formData.medications];
                  newMedications[index].frequency = e.target.value;
                  setFormData({ ...formData, medications: newMedications });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={medication.notes}
                  onChange={(e) => {
                    const newMedications = [...formData.medications];
                    newMedications[index].notes = e.target.value;
                    setFormData({ ...formData, medications: newMedications });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => handleArrayItemRemove('medications', index)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Dental History Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dental History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Last Dental Visit</label>
            <input
              type="date"
              value={formData.dentalHistory.lastDentalVisit}
              onChange={(e) => setFormData({
                ...formData,
                dentalHistory: { ...formData.dentalHistory, lastDentalVisit: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Previous Treatments</label>
            <div className="space-y-2">
              {formData.dentalHistory.previousTreatments.map((treatment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={treatment.procedure}
                    onChange={(e) => {
                      const newTreatments = [...formData.dentalHistory.previousTreatments];
                      newTreatments[index].procedure = e.target.value;
                      setFormData({
                        ...formData,
                        dentalHistory: { ...formData.dentalHistory, previousTreatments: newTreatments }
                      });
                    }}
                    className="flex-grow p-2 border rounded"
                    placeholder="Treatment procedure"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTreatments = formData.dentalHistory.previousTreatments.filter((_, i) => i !== index);
                      setFormData({
                        ...formData,
                        dentalHistory: { ...formData.dentalHistory, previousTreatments: newTreatments }
                      });
                    }}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTreatments = [...formData.dentalHistory.previousTreatments, { procedure: '' }];
                  setFormData({
                    ...formData,
                    dentalHistory: { ...formData.dentalHistory, previousTreatments: newTreatments }
                  });
                }}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <FiPlus /> Add Treatment
              </button>
            </div>
          </div>
        </div>

        {/* Dental Habits */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Dental Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dentalHistory.habits.bruxism}
                  onChange={(e) => setFormData({
                    ...formData,
                    dentalHistory: {
                      ...formData.dentalHistory,
                      habits: { ...formData.dentalHistory.habits, bruxism: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span>Bruxism (Teeth Grinding)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dentalHistory.habits.nailBiting}
                  onChange={(e) => setFormData({
                    ...formData,
                    dentalHistory: {
                      ...formData.dentalHistory,
                      habits: { ...formData.dentalHistory.habits, nailBiting: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span>Nail Biting</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dentalHistory.habits.smoking}
                  onChange={(e) => setFormData({
                    ...formData,
                    dentalHistory: {
                      ...formData.dentalHistory,
                      habits: { ...formData.dentalHistory.habits, smoking: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span>Smoking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dentalHistory.habits.alcohol}
                  onChange={(e) => setFormData({
                    ...formData,
                    dentalHistory: {
                      ...formData.dentalHistory,
                      habits: { ...formData.dentalHistory.habits, alcohol: e.target.checked }
                    }
                  })}
                  className="rounded"
                />
                <span>Alcohol Consumption</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                value={formData.dentalHistory.habits.notes}
                onChange={(e) => setFormData({
                  ...formData,
                  dentalHistory: {
                    ...formData.dentalHistory,
                    habits: { ...formData.dentalHistory.habits, notes: e.target.value }
                  }
                })}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vitals Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              value={formData.vitals.height}
              onChange={(e) => setFormData({
                ...formData,
                vitals: { ...formData.vitals, height: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              value={formData.vitals.weight}
              onChange={(e) => setFormData({
                ...formData,
                vitals: { ...formData.vitals, weight: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blood Pressure</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={formData.vitals.bloodPressure.systolic}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: {
                    ...formData.vitals,
                    bloodPressure: {
                      ...formData.vitals.bloodPressure,
                      systolic: e.target.value
                    }
                  }
                })}
                className="w-full p-2 border rounded"
                placeholder="Systolic"
              />
              <input
                type="number"
                value={formData.vitals.bloodPressure.diastolic}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: {
                    ...formData.vitals,
                    bloodPressure: {
                      ...formData.vitals.bloodPressure,
                      diastolic: e.target.value
                    }
                  }
                })}
                className="w-full p-2 border rounded"
                placeholder="Diastolic"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <input
              type="text"
              value={formData.insurance.provider}
              onChange={(e) => setFormData({
                ...formData,
                insurance: { ...formData.insurance, provider: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Policy Number</label>
            <input
              type="text"
              value={formData.insurance.policyNumber}
              onChange={(e) => setFormData({
                ...formData,
                insurance: { ...formData.insurance, policyNumber: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Group Number</label>
            <input
              type="text"
              value={formData.insurance.groupNumber}
              onChange={(e) => setFormData({
                ...formData,
                insurance: { ...formData.insurance, groupNumber: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coverage Details</label>
            <textarea
              value={formData.insurance.coverageDetails}
              onChange={(e) => setFormData({
                ...formData,
                insurance: { ...formData.insurance, coverageDetails: e.target.value }
              })}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        </div>
      </section>

      {/* Files Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Diagnostic Images & Case Files</h2>
        <FileUpload
          files={formData.files}
          onFilesChange={(files) => setFormData({ ...formData, files })}
        />
      </section>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiSave /> Save Patient History
        </button>
      </div>
    </form>
  );
};

export default PatientHistoryForm; 