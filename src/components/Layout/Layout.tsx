import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'dashboard';
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar
        activeTab={activeTab}
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
      />
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
