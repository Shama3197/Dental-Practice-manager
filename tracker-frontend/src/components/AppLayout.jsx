import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiUser,
  FiMenu,
  FiX,
  FiCalendar
} from 'react-icons/fi';
import { useState } from 'react';
import Sidebar from './Sidebar';
import ClinicIllustration from './UI/ClinicIllustration';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';
import { getCircadianState } from '../utils/themeEngine';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();

  // Get current page name for active state
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/patients') return 'Patients';
    if (path === '/appointments') return 'Appointments';
    if (path === '/treatments') return 'Treatments';
    if (path === '/reports') return 'Reports';
    return 'Dashboard';
  };

  // Get circadian state when toggle is ON
  const circadianState = isDynamicEnvironment ? getCircadianState(user.gender) : null;

  // Get background style for parent wrapper
  const getBackgroundStyle = () => {
    if (!isDynamicEnvironment) {
      return {}; // No background when toggle is OFF
    }
    return {
      backgroundImage: `url(${circadianState?.bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      transition: 'background-image 0.8s ease-in-out',
    };
  };

  return (
    <div 
      className={`flex h-screen w-screen overflow-hidden transition-all duration-300 ${isDynamicEnvironment ? 'dynamic-bg-container' : ''}`}
      style={{
        ...getBackgroundStyle(),
        ...(!isDynamicEnvironment && { background: 'linear-gradient(to bottom right, #ecfeff, #f0fdfa)' })
      }}
    >
      {/* Sidebar - fixed width, no overlap */}
      <aside className="w-64 min-w-64 h-full shadow-lg flex-shrink-0 flex flex-col z-10">
        <Sidebar active={getCurrentPage()}>
          <NavLink to="/calendar" className="sidebar-link">
            <FiCalendar className="sidebar-icon" />
            Calendar
          </NavLink>
        </Sidebar>
      </aside>
      {/* Main content area */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Decorative Monstera leaf in top-right */}
        <div className="absolute top-4 right-4 z-0 opacity-20 pointer-events-none">
          <ClinicIllustration size="lg" />
        </div>
        {/* Decorative SVG in lower-left (optional) */}
        <svg className="absolute bottom-0 left-0 opacity-10 pointer-events-none" width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,240 Q60,60 240,0 Q180,180 0,240 Z" fill="#b3e0ef" fillOpacity="0.35"/>
          <path d="M30,210 Q80,100 210,30 Q150,150 30,210 Z" fill="#87ceeb" fillOpacity="0.25"/>
        </svg>
        <div className="content-wrapper relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 