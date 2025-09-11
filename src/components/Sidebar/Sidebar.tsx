import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onMobileMenuClose?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ activeTab, onMobileMenuClose }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      id: 'today-expenses',
      label: 'Dữ liệu chi tiêu',
      icon: '📅',
    },
    {
      id: 'expense-categories',
      label: 'Phân loại chi tiêu',
      icon: '🗂️',
    },
    {
      id: 'set-budget',
      label: 'Thiết lập hạn mức',
      icon: '🎯',
    },
    {
      id: 'reports',
      label: 'Xem báo cáo',
      icon: '📈',
    },
    {
      id: 'account',
      label: 'Quản lý tài khoản',
      icon: '👤',
    },
  ];

  return (
    <div className='w-full sm:w-56 md:w-64 card-glass border-r min-h-screen sm:sticky sm:top-0'>
      <div className='p-3 sm:p-4 md:p-6'>
        <div className='mb-4 sm:mb-6 md:mb-8 hidden sm:block'>
          <h2 className='text-base sm:text-lg md:text-xl font-bold text-primary flex items-center gap-2'>
            <span className='text-xl sm:text-2xl'>💳</span>
            <span className='text-gradient'>Chi tiêu Portal</span>
          </h2>
        </div>

        <nav className='space-y-1 sm:space-y-1.5 md:space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              onClick={onMobileMenuClose}
              className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30 shadow-lg'
                  : 'text-secondary hover:bg-surface-secondary/50 hover:text-primary'
              }`}
              style={{
                backgroundColor:
                  activeTab === item.id
                    ? 'var(--theme-primary)'
                    : 'transparent',
                color:
                  activeTab === item.id
                    ? 'white'
                    : 'var(--theme-text-secondary)',
                borderColor:
                  activeTab === item.id
                    ? 'var(--theme-primary)'
                    : 'transparent',
              }}
            >
              <span className='text-base sm:text-lg flex-shrink-0'>
                {item.icon}
              </span>
              <span className='text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden'>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Theme Switcher for Desktop */}
        <div
          className='hidden sm:block mt-6 pt-4'
          style={{ borderTop: '1px solid var(--theme-border)' }}
        >
          <div className='px-2'>
            <div className='text-xs font-semibold text-muted uppercase tracking-wider mb-2'>
              Theme
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
