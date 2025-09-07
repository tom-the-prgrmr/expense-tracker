import { useEffect, useState } from 'react';
import type {
  CategoryBreakdown,
  DashboardStats,
  Expense,
} from '../../types/expense';

// Sample data for demonstration
const sampleExpenses: Expense[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.5,
    category: 'Food',
    date: '2024-01-15',
    description: 'Weekly grocery shopping at Walmart',
  },
  {
    id: '2',
    title: 'Gas Station',
    amount: 45.2,
    category: 'Transportation',
    date: '2024-01-14',
    description: 'Fuel for car',
  },
  {
    id: '3',
    title: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2024-01-13',
    description: 'Monthly subscription',
  },
  {
    id: '4',
    title: 'Coffee Shop',
    amount: 12.75,
    category: 'Food',
    date: '2024-01-12',
    description: 'Morning coffee and pastry',
  },
  {
    id: '5',
    title: 'Electric Bill',
    amount: 120.0,
    category: 'Utilities',
    date: '2024-01-11',
    description: 'Monthly electricity bill',
  },
  {
    id: '6',
    title: 'Restaurant Dinner',
    amount: 65.8,
    category: 'Food',
    date: '2024-01-10',
    description: 'Dinner with friends',
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    monthlyExpenses: 0,
    categoryBreakdown: [],
    recentExpenses: [],
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const totalExpenses = sampleExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate monthly expenses (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = sampleExpenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category breakdown
    const categoryMap = new Map<string, number>();
    sampleExpenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const categoryBreakdown: CategoryBreakdown[] = Array.from(
      categoryMap.entries()
    ).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100,
      color: getCategoryColor(category),
    }));

    // Sort by amount descending
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    // Get recent expenses (last 5)
    const recentExpenses = [...sampleExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setStats({
      totalExpenses,
      monthlyExpenses,
      categoryBreakdown,
      recentExpenses,
    });
  }, []);

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Food: '#FF6B6B',
      Transportation: '#4ECDC4',
      Entertainment: '#45B7D1',
      Utilities: '#96CEB4',
      Shopping: '#FFEAA7',
      Healthcare: '#DDA0DD',
      Other: '#98D8C8',
    };
    return colors[category] || '#98D8C8';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='w-full p-4 sm:p-6 lg:p-8 font-sans'>
      <header className='text-center mb-8 sm:mb-12'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
          Expense Dashboard
        </h1>
        <p className='text-sm sm:text-base lg:text-lg text-gray-600'>
          Track and manage your expenses
        </p>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12'>
        <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='text-3xl sm:text-4xl opacity-90'>💰</div>
          <div>
            <h3 className='text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wide mb-1'>
              Total Expenses
            </h3>
            <p className='text-xl sm:text-2xl font-bold'>
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='text-3xl sm:text-4xl opacity-90'>📅</div>
          <div>
            <h3 className='text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wide mb-1'>
              This Month
            </h3>
            <p className='text-xl sm:text-2xl font-bold'>
              {formatCurrency(stats.monthlyExpenses)}
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='text-3xl sm:text-4xl opacity-90'>📊</div>
          <div>
            <h3 className='text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wide mb-1'>
              Categories
            </h3>
            <p className='text-xl sm:text-2xl font-bold'>
              {stats.categoryBreakdown.length}
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
          <div className='text-3xl sm:text-4xl opacity-90'>📝</div>
          <div>
            <h3 className='text-xs sm:text-sm font-medium opacity-90 uppercase tracking-wide mb-1'>
              Transactions
            </h3>
            <p className='text-xl sm:text-2xl font-bold'>
              {sampleExpenses.length}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12'>
        <div className='bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100'>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 pb-2 border-b-2 border-gray-100'>
            Expense Categories
          </h2>
          <div className='space-y-4'>
            {stats.categoryBreakdown.map((category) => (
              <div
                key={category.category}
                className='flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className='w-3 h-3 rounded-full flex-shrink-0'
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className='font-medium text-gray-900'>
                    {category.category}
                  </span>
                </div>
                <div className='text-right'>
                  <span className='font-semibold text-gray-900 block text-sm sm:text-base'>
                    {formatCurrency(category.amount)}
                  </span>
                  <span className='text-xs sm:text-sm text-gray-500'>
                    ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100'>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 pb-2 border-b-2 border-gray-100'>
            Recent Transactions
          </h2>
          <div className='space-y-4'>
            {stats.recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className='flex justify-between items-start p-4 sm:p-5 bg-gray-50 rounded-xl border-l-4 border-indigo-500 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1'
              >
                <div className='flex-1'>
                  <h4 className='text-sm sm:text-base font-semibold text-gray-900 mb-1'>
                    {expense.title}
                  </h4>
                  <p className='text-xs sm:text-sm text-indigo-600 font-medium mb-1'>
                    {expense.category}
                  </p>
                  <p className='text-[11px] sm:text-xs text-gray-500 mb-2'>
                    {formatDate(expense.date)}
                  </p>
                  {expense.description && (
                    <p className='text-xs sm:text-sm text-gray-600 italic'>
                      {expense.description}
                    </p>
                  )}
                </div>
                <div className='text-base sm:text-lg font-bold text-red-600 text-right'>
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex justify-center gap-3 sm:gap-4 flex-wrap'>
        <button className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base uppercase tracking-wide hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>
          Add Expense
        </button>
        <button className='bg-white text-indigo-600 border-2 border-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base uppercase tracking-wide hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1'>
          View Reports
        </button>
        <button className='bg-white text-indigo-600 border-2 border-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base uppercase tracking-wide hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1'>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
