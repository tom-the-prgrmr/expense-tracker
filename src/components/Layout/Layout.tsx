import { type FC, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';

const Layout: FC = () => {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'dashboard';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='flex flex-col sm:flex-row min-h-screen'>
      {/* Mobile Header */}
      <div className='sm:hidden card-glass border-b px-4 py-4 flex items-center justify-between relative' style={{ borderBottomColor: 'var(--theme-border)', zIndex: 1000 }}>
        <h1 className='text-lg font-bold text-primary flex items-center gap-2'>
          <span className='text-xl'>💳</span>
          <span className='text-gradient'>Chi tiêu Portal</span>
        </h1>
        <div className='flex items-center gap-2'>
          <ThemeSwitcher />
          <button
            onClick={toggleMobileMenu}
            className='p-2 rounded-xl transition-all duration-200'
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--theme-text)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6 transition-transform duration-200'
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
      </div>

      {/* Desktop Top Header removed (reverted) */}

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
        <Sidebar 
          activeTab={activeTab} 
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className='flex-1 overflow-auto' style={{ backgroundColor: 'var(--theme-background)', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
