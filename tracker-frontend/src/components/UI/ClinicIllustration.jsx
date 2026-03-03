import React from 'react';

const ClinicIllustration = ({ className = '', size = 'md' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      case 'xl':
        return 'w-48 h-48';
      default:
        return 'w-24 h-24';
    }
  };

  return (
    <div className={`${getSizeClasses()} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main abstract shape – muted gold / slate */}
        <path
          d="M10,90 Q25,60 50,20 Q75,60 90,90 Q75,80 50,85 Q25,80 10,90 Z"
          fill="#f2d472"
          fillOpacity="0.18"
        />
        
        {/* Secondary layer */}
        <path
          d="M15,85 Q30,65 50,30 Q70,65 85,85 Q70,75 50,80 Q30,75 15,85 Z"
          fill="#9ca3af"
          fillOpacity="0.22"
        />
        
        {/* Veins / tech lines */}
        <path
          d="M50,20 Q50,40 50,60 Q50,80 50,85"
          stroke="#f2d472"
          strokeWidth="0.5"
          fill="none"
        />
        
        <path
          d="M35,30 Q40,45 45,60 Q47,75 50,85"
          stroke="#f2d472"
          strokeWidth="0.3"
          fill="none"
        />
        
        <path
          d="M65,30 Q60,45 55,60 Q53,75 50,85"
          stroke="#f2d472"
          strokeWidth="0.3"
          fill="none"
        />
        
        {/* Cutouts / orbits */}
        <ellipse
          cx="35"
          cy="45"
          rx="3"
          ry="2"
          fill="none"
          stroke="#f2d472"
          strokeWidth="0.2"
        />
        
        <ellipse
          cx="65"
          cy="45"
          rx="3"
          ry="2"
          fill="none"
          stroke="#f2d472"
          strokeWidth="0.2"
        />
        
        <ellipse
          cx="45"
          cy="65"
          rx="2"
          ry="1.5"
          fill="none"
          stroke="#f2d472"
          strokeWidth="0.2"
        />
        
        <ellipse
          cx="55"
          cy="65"
          rx="2"
          ry="1.5"
          fill="none"
          stroke="#f2d472"
          strokeWidth="0.2"
        />
        
        {/* Stem / anchor */}
        <path
          d="M50,85 Q50,95 50,100"
          stroke="#6b7280"
          strokeWidth="0.8"
          strokeOpacity="0.6"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default ClinicIllustration; 