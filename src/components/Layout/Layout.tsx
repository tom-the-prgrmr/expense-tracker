import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'dashboard';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='flex flex-col sm:flex-row min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <div className='sm:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
        <h1 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
          <span className='text-xl'>💳</span>
          Chi tiêu Portal
        </h1>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
          aria-label='Toggle menu'
        >
          <svg
            className='w-6 h-6 text-gray-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
        <Sidebar activeTab={activeTab} />
      </div>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
