import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  action, 
  image,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* Icon or Image */}
      {Icon && (
        <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      )}
      {image && (
        <img 
          src={image} 
          alt="Empty state" 
          className="w-32 h-32 mx-auto mb-4 opacity-50"
        />
      )}
      
      {/* Title */}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
      )}
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {subtitle}
        </p>
      )}
      
      {/* Action Button */}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 