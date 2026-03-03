import React, { useState } from 'react';
import LabWorkList from '../components/Labwork/LabWorkList';
import AddLabWorkForm from '../components/Labwork/AddLabWorkForm';
import LabWorkDetails from '../components/Labwork/LabWorkDetails';
import { useNavigate } from 'react-router-dom';
import LabWorkDashboard from '../components/Labwork/LabWorkDashboard';
import LabWork from '../components/LabWork';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';
import { getCircadianState } from '../utils/themeEngine';

const LabworkPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();
  const circadianState = getCircadianState(user.gender);

  // Get adaptive title color
  const getTitleColor = () => {
    if (!isDynamicEnvironment) {
      return 'text-gray-900';
    }
    if (circadianState?.theme === 'night') {
      return 'text-white drop-shadow-lg';
    }
    return 'text-gray-900';
  };

  const handleView = (id) => {
    navigate(`/labwork/${id}`);
  };

  return (
    <div className="section-spacing">
      <LabWork />
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        <LabWorkDashboard />
        <div className="flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${getTitleColor()}`}>Lab Work Tracker</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(f => !f)}>
            {showForm ? 'Close Form' : 'Add Lab Work'}
          </button>
        </div>
        {showForm && <AddLabWorkForm onSuccess={() => { setShowForm(false); setRefresh(r => !r); }} />}
        <LabWorkList onView={handleView} key={refresh} />
      </div>
    </div>
  );
};

export default LabworkPage; 