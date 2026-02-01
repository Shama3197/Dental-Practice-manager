import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const ToothSelector = ({ 
  selectedTeeth = [], 
  onTeethChange, 
  showLabels = true,
  size = 'md',
  className = '' 
}) => {
  const [hoveredTooth, setHoveredTooth] = useState(null);

  const toothNumbers = Array.from({ length: 32 }, (_, i) => i + 1);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs';
      case 'md':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-10 h-10 text-base';
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  const getGridClasses = () => {
    switch (size) {
      case 'sm':
        return 'grid-cols-16 gap-1';
      case 'md':
        return 'grid-cols-16 gap-1';
      case 'lg':
        return 'grid-cols-16 gap-2';
      default:
        return 'grid-cols-16 gap-1';
    }
  };

  const handleToothToggle = (toothNumber) => {
    const newSelectedTeeth = selectedTeeth.includes(toothNumber)
      ? selectedTeeth.filter(t => t !== toothNumber)
      : [...selectedTeeth, toothNumber];
    
    onTeethChange(newSelectedTeeth);
  };

  const getToothColor = (toothNumber) => {
    if (selectedTeeth.includes(toothNumber)) {
      return 'bg-blue-500 text-white border-blue-500 shadow-md';
    }
    if (hoveredTooth === toothNumber) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  const getToothLabel = (toothNumber) => {
    if (toothNumber <= 16) {
      return `Upper ${toothNumber}`;
    } else {
      return `Lower ${toothNumber}`;
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">FDI Tooth Chart</h4>
        <p className="text-xs text-gray-500">
          Upper teeth: 1-16, Lower teeth: 17-32
        </p>
      </div>

      {/* Tooth Grid */}
      <div className="space-y-2">
        {/* Upper teeth (1-16) */}
        <div className={`grid ${getGridClasses()} mb-2`}>
          {toothNumbers.slice(0, 16).map(tooth => (
            <button
              key={tooth}
              type="button"
              onClick={() => handleToothToggle(tooth)}
              onMouseEnter={() => setHoveredTooth(tooth)}
              onMouseLeave={() => setHoveredTooth(null)}
              className={`${getSizeClasses()} font-medium rounded border transition-all duration-200 ${getToothColor(tooth)}`}
              title={showLabels ? getToothLabel(tooth) : `Tooth ${tooth}`}
            >
              {tooth}
            </button>
          ))}
        </div>
        
        {/* Lower teeth (17-32) */}
        <div className={`grid ${getGridClasses()}`}>
          {toothNumbers.slice(16).map(tooth => (
            <button
              key={tooth}
              type="button"
              onClick={() => handleToothToggle(tooth)}
              onMouseEnter={() => setHoveredTooth(tooth)}
              onMouseLeave={() => setHoveredTooth(null)}
              className={`${getSizeClasses()} font-medium rounded border transition-all duration-200 ${getToothColor(tooth)}`}
              title={showLabels ? getToothLabel(tooth) : `Tooth ${tooth}`}
            >
              {tooth}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Teeth Summary */}
      {selectedTeeth.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Teeth ({selectedTeeth.length})
            </span>
            <button
              onClick={() => onTeethChange([])}
              className="text-xs text-red-600 hover:text-red-800 flex items-center"
            >
              <FiX className="w-3 h-3 mr-1" />
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTeeth.sort((a, b) => a - b).map(tooth => (
              <span
                key={tooth}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex items-center"
              >
                {tooth}
                <button
                  onClick={() => handleToothToggle(tooth)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Selection Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTeethChange(toothNumbers.slice(0, 8))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Upper Right
          </button>
          <button
            onClick={() => onTeethChange(toothNumbers.slice(8, 16))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Upper Left
          </button>
          <button
            onClick={() => onTeethChange(toothNumbers.slice(16, 24))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Lower Right
          </button>
          <button
            onClick={() => onTeethChange(toothNumbers.slice(24))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Lower Left
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToothSelector; 