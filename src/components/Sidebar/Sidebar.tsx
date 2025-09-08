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
      id: 'add-expense',
      label: 'Ghi nhận chi tiêu',
      icon: '💰',
    },
    {
      id: 'set-budget',
      label: 'Thiết lập hạn mức',
      icon: '🎯',
    },
    {
      id: 'today-expenses',
      label: 'Chi tiêu hôm nay',
      icon: '📅',
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
    <div className="w-full sm:w-56 md:w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen sm:sticky sm:top-0">
      <div className='p-3 sm:p-4 md:p-6'>
        <div className='mb-4 sm:mb-6 md:mb-8 hidden sm:block'>
          <h2 className='text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2'>
            <span className='text-xl sm:text-2xl'>💳</span>
            Chi tiêu Portal
          </h2>
        </div>

        <nav className='space-y-1 sm:space-y-1.5 md:space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              onClick={onMobileMenuClose}
              className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base sm:text-lg flex-shrink-0">
                {item.icon}
              </span>
              <span className='text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden'>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
