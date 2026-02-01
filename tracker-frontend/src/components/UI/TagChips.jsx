import React from 'react';
import { FiX } from 'react-icons/fi';

const TagChips = ({ 
  tags = [], 
  onRemove, 
  onToggle, 
  color = 'blue',
  size = 'md',
  removable = true,
  selectable = false,
  className = '' 
}) => {
  const getColorClasses = (isSelected = false) => {
    const baseClasses = 'inline-flex items-center rounded-full border font-medium transition-colors';
    
    if (isSelected) {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-500 text-white border-blue-500`;
        case 'green':
          return `${baseClasses} bg-green-500 text-white border-green-500`;
        case 'red':
          return `${baseClasses} bg-red-500 text-white border-red-500`;
        case 'yellow':
          return `${baseClasses} bg-yellow-500 text-white border-yellow-500`;
        case 'purple':
          return `${baseClasses} bg-purple-500 text-white border-purple-500`;
        case 'pink':
          return `${baseClasses} bg-pink-500 text-white border-pink-500`;
        case 'indigo':
          return `${baseClasses} bg-indigo-500 text-white border-indigo-500`;
        case 'gray':
          return `${baseClasses} bg-gray-500 text-white border-gray-500`;
        default:
          return `${baseClasses} bg-blue-500 text-white border-blue-500`;
      }
    } else {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`;
        case 'green':
          return `${baseClasses} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`;
        case 'red':
          return `${baseClasses} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`;
        case 'yellow':
          return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100`;
        case 'purple':
          return `${baseClasses} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100`;
        case 'pink':
          return `${baseClasses} bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100`;
        case 'indigo':
          return `${baseClasses} bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100`;
        case 'gray':
          return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100`;
        default:
          return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`;
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  const handleClick = (tag) => {
    if (selectable && onToggle) {
      onToggle(tag);
    }
  };

  const handleRemove = (tag, e) => {
    e.stopPropagation();
    if (removable && onRemove) {
      onRemove(tag);
    }
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={typeof tag === 'object' ? tag.id || index : tag}
          className={`${getColorClasses(tag.selected)} ${getSizeClasses()} ${
            selectable ? 'cursor-pointer' : ''
          }`}
          onClick={() => handleClick(tag)}
        >
          <span className="mr-1">
            {typeof tag === 'object' ? tag.label || tag.name : tag}
          </span>
          {removable && onRemove && (
            <button
              onClick={(e) => handleRemove(tag, e)}
              className={`ml-1 ${getIconSize()} hover:scale-110 transition-transform`}
            >
              <FiX />
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

export default TagChips; 