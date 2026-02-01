import React from 'react';

const IconBadge = ({ 
  icon: Icon, 
  label, 
  active = false, 
  color = 'blue', 
  size = 'md',
  onClick,
  className = ''
}) => {
  const getColorClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-lg border transition-all duration-200';
    
    if (active) {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-500 text-white border-blue-500 shadow-md`;
        case 'green':
          return `${baseClasses} bg-green-500 text-white border-green-500 shadow-md`;
        case 'red':
          return `${baseClasses} bg-red-500 text-white border-red-500 shadow-md`;
        case 'yellow':
          return `${baseClasses} bg-yellow-500 text-white border-yellow-500 shadow-md`;
        case 'purple':
          return `${baseClasses} bg-purple-500 text-white border-purple-500 shadow-md`;
        case 'pink':
          return `${baseClasses} bg-pink-500 text-white border-pink-500 shadow-md`;
        case 'indigo':
          return `${baseClasses} bg-indigo-500 text-white border-indigo-500 shadow-md`;
        case 'gray':
          return `${baseClasses} bg-gray-500 text-white border-gray-500 shadow-md`;
        default:
          return `${baseClasses} bg-blue-500 text-white border-blue-500 shadow-md`;
      }
    } else {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300`;
        case 'green':
          return `${baseClasses} bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300`;
        case 'red':
          return `${baseClasses} bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300`;
        case 'yellow':
          return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300`;
        case 'purple':
          return `${baseClasses} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300`;
        case 'pink':
          return `${baseClasses} bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300`;
        case 'indigo':
          return `${baseClasses} bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300`;
        case 'gray':
          return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300`;
        default:
          return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300`;
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
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

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`${getColorClasses()} ${getSizeClasses()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {Icon && (
        <Icon className={`${getIconSize()} ${label ? 'mr-2' : ''}`} />
      )}
      {label && (
        <span className="font-medium">{label}</span>
      )}
    </Component>
  );
};

export default IconBadge; 