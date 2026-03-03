import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-background-light dark:bg-background-dark`}>
      <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-1 p-6 pb-3">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 