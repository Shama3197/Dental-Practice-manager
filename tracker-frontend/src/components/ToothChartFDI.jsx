import React, { useState, useEffect } from 'react';

const ADULT_TEETH = [
  // Upper arch: Quadrant 1 (UR): 18-11, Quadrant 2 (UL): 21-28
  [
    { q: 'UR', teeth: [18,17,16,15,14,13,12,11] },
    { q: 'UL', teeth: [21,22,23,24,25,26,27,28] },
  ],
  // Lower arch: Quadrant 3 (LL): 38-31, Quadrant 4 (LR): 41-48
  [
    { q: 'LL', teeth: [38,37,36,35,34,33,32,31] },
    { q: 'LR', teeth: [41,42,43,44,45,46,47,48] },
  ],
];

const CHILD_TEETH = [
  // Upper arch: Quadrant 5 (UR): 55-51, Quadrant 6 (UL): 61-65
  [
    { q: 'UR', teeth: [55,54,53,52,51] },
    { q: 'UL', teeth: [61,62,63,64,65] },
  ],
  // Lower arch: Quadrant 7 (LL): 75-71, Quadrant 8 (LR): 81-85
  [
    { q: 'LL', teeth: [75,74,73,72,71] },
    { q: 'LR', teeth: [81,82,83,84,85] },
  ],
];

const QUADRANT_LABELS = {
  UR: 'Upper Right',
  UL: 'Upper Left',
  LL: 'Lower Left',
  LR: 'Lower Right',
};

const ToothChartFDI = ({ selectedTeeth = [], onTeethChange }) => {
  const [mode, setMode] = useState('adult');
  const [hoveredTooth, setHoveredTooth] = useState(null);

  const chartData = mode === 'adult' ? ADULT_TEETH : CHILD_TEETH;

  const handleToothClick = (toothNumber) => {
    if (onTeethChange) {
      const newSelectedTeeth = selectedTeeth.includes(toothNumber)
        ? selectedTeeth.filter(t => t !== toothNumber)
        : [...selectedTeeth, toothNumber];
      onTeethChange(newSelectedTeeth);
    }
  };

  const renderTooth = (number, position) => {
    const isSelected = selectedTeeth.includes(number);
    const isHovered = hoveredTooth === number;

    return (
      <div
        key={number}
        className={`relative cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-110' : 'hover:scale-105'
        }`}
        onClick={() => handleToothClick(number)}
        onMouseEnter={() => setHoveredTooth(number)}
        onMouseLeave={() => setHoveredTooth(null)}
      >
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
            ${isSelected ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}
            ${isHovered ? 'shadow-lg' : ''}`}
        >
          {number}
        </div>
        {isHovered && (
          <div className="absolute z-10 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
               style={{
                 top: position === 'top' ? '-8px' : '100%',
                 left: '50%',
                 transform: 'translateX(-50%)'
               }}>
            Tooth {number}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none ${mode === 'adult' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('adult')}
        >
          Adult (FDI 1–8)
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg border-t border-b border-r border-gray-300 focus:outline-none ${mode === 'child' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('child')}
        >
          Child (FDI A–E)
        </button>
      </div>

      {/* Chart */}
      <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
        {/* Upper teeth */}
        <div className="col-span-8 grid grid-cols-8 gap-2 mb-4">
          {chartData[0][0].teeth.map(num => renderTooth(num, 'top'))}
        </div>
        <div className="col-span-8 grid grid-cols-8 gap-2 mb-4">
          {chartData[0][1].teeth.map(num => renderTooth(num, 'top'))}
        </div>

        {/* Lower teeth */}
        <div className="col-span-8 grid grid-cols-8 gap-2 mb-4">
          {chartData[1][0].teeth.map(num => renderTooth(num, 'bottom'))}
        </div>
        <div className="col-span-8 grid grid-cols-8 gap-2">
          {chartData[1][1].teeth.map(num => renderTooth(num, 'bottom'))}
        </div>
      </div>

      {/* Selected teeth display */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Selected Teeth: </span>
        <span className="font-mono text-blue-700 text-base">{selectedTeeth.length > 0 ? selectedTeeth.join(', ') : 'None'}</span>
      </div>
    </div>
  );
};

export default ToothChartFDI; 