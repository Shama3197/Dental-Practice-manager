import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMail, FiCalendar, FiHeart, FiShield, FiDollarSign, FiActivity, FiArrowLeft } from 'react-icons/fi';
import ClinicIllustration from '../UI/ClinicIllustration';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('odontogram');

  const tabs = [
    { id: 'odontogram', label: 'Odontogram', icon: FiActivity },
    { id: 'treatment-plan', label: 'Treatment Plan', icon: FiHeart },
    { id: 'financials', label: 'Financials', icon: FiDollarSign },
    { id: 'ai-insights', label: 'AI Insights', icon: FiShield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-mint-50 relative overflow-hidden">
      {/* Decorative Leaf - Bottom Left */}
      <div className="absolute bottom-4 left-4 opacity-20 pointer-events-none">
        <ClinicIllustration size="xl" />
      </div>

      {/* Decorative Leaf - Top Right */}
      <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
        <ClinicIllustration size="lg" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto mb-4">
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Patients</span>
          </button>
        </div>

        {/* Patient Details Card */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sarah Johnson</h1>
                    <p className="text-gray-600">Patient ID: #P-2024-001</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-cyan-600" />
                    <span className="text-gray-700">Age: 34 years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-cyan-600" />
                    <span className="text-gray-700">Gender: Female</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4 text-cyan-600" />
                    <span className="text-gray-700">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-cyan-600" />
                    <span className="text-gray-700">sarah.j@email.com</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical History</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Allergies:</strong> Penicillin, Latex
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      <strong>Conditions:</strong> Hypertension (controlled)
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Dental Info & Insurance */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Dental History</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>Last Cleaning:</strong> March 15, 2024
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Current Treatment:</strong> Root canal on tooth #14
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Next Appointment:</strong> April 20, 2024
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Insurance Status</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Active Coverage</p>
                        <p className="text-xs text-green-600">Blue Cross Dental Plus</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-700">80% Coverage</p>
                        <p className="text-xs text-green-600">$2,000 remaining</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Total Visits</p>
                    <p className="text-lg font-bold text-gray-800">12</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Last Visit</p>
                    <p className="text-lg font-bold text-gray-800">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-cyan-600 border-b-2 border-cyan-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = tabs.find(tab => tab.id === activeTab)?.icon || FiActivity;
                    return <Icon className="w-8 h-8 text-cyan-600" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600">
                  This is the {tabs.find(tab => tab.id === activeTab)?.label} section.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Content will be dynamically loaded here based on the selected tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile; 