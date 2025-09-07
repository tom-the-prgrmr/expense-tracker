import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar = ({ activeTab, isExpanded, onToggle }: SidebarProps) => {
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
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } bg-white shadow-lg border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out`}
    >
      <div className='p-6'>
        <div className='flex items-center justify-between mb-8'>
          {isExpanded && (
            <h2 className='text-xl font-bold text-gray-900'>Expense Tracker</h2>
          )}
          <button
            onClick={onToggle}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              />
            </svg>
          </button>
        </div>

        <nav className='space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <span className='text-lg flex-shrink-0'>{item.icon}</span>
              {isExpanded && (
                <span className='font-medium whitespace-nowrap overflow-hidden'>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
