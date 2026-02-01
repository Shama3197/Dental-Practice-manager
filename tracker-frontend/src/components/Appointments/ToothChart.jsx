import React, { useState, useEffect } from 'react';

const teethData = [
  // Only one simple circle for debugging
  { id: 1, quadrant: 'debug', path: 'M 50 50 m -40, 0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0' },
];

const ToothChart = ({ selectedTeeth, onToothSelect }) => {
  const [currentSelectedTeeth, setCurrentSelectedTeeth] = useState(selectedTeeth || []);

  useEffect(() => {
    setCurrentSelectedTeeth(selectedTeeth || []);
  }, [selectedTeeth]);

  const handleToothClick = (toothId) => {
    let updatedSelectedTeeth;
    if (currentSelectedTeeth.includes(toothId)) {
      updatedSelectedTeeth = currentSelectedTeeth.filter((id) => id !== toothId);
    } else {
      updatedSelectedTeeth = [...currentSelectedTeeth, toothId];
    }
    setCurrentSelectedTeeth(updatedSelectedTeeth);
    onToothSelect(updatedSelectedTeeth);
  };

  const getToothColor = (toothId) => {
    return currentSelectedTeeth.includes(toothId) ? '#3B82F6' : '#CBD5E0';
  };

  const getToothTransform = (id) => {
    // Fixed position and scale for the single debugging tooth
    return `translate(150, 100) scale(1.0)`;
  };

  return (
    <div className="tooth-chart-container p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Select Teeth</h3>
      <svg viewBox="0 0 300 200" className="w-full h-auto">
        {teethData.map((tooth) => (
          <g
            key={tooth.id}
            transform={getToothTransform(tooth.id)}
            onClick={() => handleToothClick(tooth.id)}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <path
              d={tooth.path}
              fill="red" // Extremely visible color
            />
            <text
              x="50"
              y="50"
              fontSize="30"
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white" // Clearly visible text color
              className="select-none pointer-events-none"
            >
              {tooth.id}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Selected Teeth: {currentSelectedTeeth.length > 0 ? currentSelectedTeeth.join(', ') : 'None'}
      </div>
    </div>
  );
};

export default ToothChart; 