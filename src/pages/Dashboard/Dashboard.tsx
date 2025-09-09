
import { type FC, useState } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import RadialProgress from '@/components/Charts/RadialProgress';
import PieChart from '@/components/Charts/PieChart';

const Dashboard: FC = () => {
  // Placeholder data; replace with real data later
  const limitAmount = 5000000; // hạn mức ngày (VND)
  const spentToday = 1200000; // đã chi hôm nay
  const remaining = Math.max(limitAmount - spentToday, 0);
  const withinLimit = spentToday <= limitAmount;
  const spentPercent = Math.min((spentToday / limitAmount) * 100, 100);

  const todayList = [
    { id: '1', time: '08:20', title: 'Cà phê sáng', amount: 45000 },
    { id: '2', time: '12:15', title: 'Cơm trưa', amount: 65000 },
    { id: '3', time: '18:40', title: 'Xăng xe', amount: 120000 },
    { id: '4', time: '19:10', title: 'Trà sữa', amount: 52000 },
    { id: '5', time: '20:05', title: 'Bánh ngọt', amount: 38000 },
    { id: '6', time: '21:30', title: 'Thuốc', amount: 68000 },
  ];

  // Pagination for Today Expenses
  const [todayPage, setTodayPage] = useState(1);
  const pageSize = 4;
  const totalTodayPages = Math.max(1, Math.ceil(todayList.length / pageSize));
  const startIdx = (todayPage - 1) * pageSize;
  const pagedTodayList = todayList.slice(startIdx, startIdx + pageSize);
  const goTodayPage = (p: number) => setTodayPage(Math.min(Math.max(1, p), totalTodayPages));

  const categories = [
    { label: 'Ăn uống', value: 45, color: '#6366F1' },
    { label: 'Di chuyển', value: 25, color: '#22C55E' },
    { label: 'Giải trí', value: 15, color: '#F59E0B' },
    { label: 'Khác', value: 15, color: '#EF4444' },
  ];

  const monthTotal = 12500000;
  const txCount = 86;
  const avgPerDay = 416000;

  return (
    <PageLayout
      title="Dashboard"
      icon="📊"
      subtitle="Tổng quan hạn mức, chi tiêu hôm nay, top danh mục và báo cáo nhanh"
    >
      {/* 2x2 corners on md+, stacked on mobile */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 xl:gap-8'>
        {/* 1) Tổng quan hạn mức và số dư trong ngày (Top-left) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6'>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              withinLimit 
                ? 'bg-gradient-to-r from-accent-green/20 to-accent-green/10 text-accent-green border border-accent-green/30' 
                : 'bg-gradient-to-r from-accent-red/20 to-accent-red/10 text-accent-red border border-accent-red/30'
            }`}>
              <span className='text-lg'>{withinLimit ? '✅' : '⚠️'}</span>
              {withinLimit ? 'Trong hạn mức' : 'Quá hạn mức'}
            </div>
            <div className='text-sm text-secondary'>
              Hạn mức: <span className='font-semibold text-primary'>{limitAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center'>
            {/* Radial progress */}
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <RadialProgress percent={spentPercent} size={160} barColor={withinLimit ? '#10b981' : '#ef4444'} />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className='text-[11px] sm:text-xs text-muted mb-1'>Đã chi</div>
                  <div className='text-base sm:text-lg font-bold text-primary leading-tight text-center'>
                    {spentToday.toLocaleString('vi-VN')}₫
                  </div>
                  <div className='text-[10px] sm:text-[11px] text-muted'>
                    {spentPercent.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Figures (first two fixed on same row) */}
            <div className='md:col-span-2 flex flex-col gap-3 sm:gap-4'>
              <div className='flex gap-3 sm:gap-4 w-full'>
                <div className='card-glass p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-muted mb-1'>Hạn mức</div>
                  <div className='text-base sm:text-lg font-bold text-primary leading-tight'>
                    {limitAmount.toLocaleString('vi-VN')}₫
                  </div>
                </div>
                <div className='card-glass p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-muted mb-1'>Đã chi</div>
                  <div className='text-base sm:text-lg font-bold text-primary leading-tight'>
                    {spentToday.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
              <div className='card-glass p-3 sm:p-4 w-full'>
                <div className='text-xs text-muted mb-1'>Còn lại</div>
                <div className={`text-base sm:text-lg font-bold leading-tight ${
                  withinLimit ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {remaining.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2) Chi tiêu hôm nay (Top-right) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-primary'>Chi tiêu hôm nay</h2>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='text-xs sm:text-sm text-secondary'>
                Tổng: <span className='font-semibold text-primary leading-tight'>{todayList.reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')}₫</span>
              </div>
              <button className='btn-primary px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm'>
                + Thêm chi tiêu
              </button>
            </div>
          </div>
          <div className='divide-y divide-white/10'>
            {pagedTodayList.map((e) => (
              <div key={e.id} className='flex items-center justify-between py-2.5 sm:py-3'>
                <div className='flex items-center gap-3'>
                  <div className='text-[11px] sm:text-xs text-muted w-12'>{e.time}</div>
                  <div className='text-sm font-medium text-primary'>{e.title}</div>
                </div>
                <div className='text-sm font-semibold text-primary leading-tight text-right'>
                  {e.amount.toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className='flex items-center justify-between pt-3'>
            <button
              className='btn-secondary px-3 py-1.5 text-sm disabled:opacity-50'
              onClick={() => goTodayPage(todayPage - 1)}
              disabled={todayPage === 1}
            >
              Trước
            </button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: totalTodayPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-md text-sm border ${
                    p === todayPage 
                      ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white border-transparent' 
                      : 'bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50'
                  }`}
                  onClick={() => goTodayPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className='btn-secondary px-3 py-1.5 text-sm disabled:opacity-50'
              onClick={() => goTodayPage(todayPage + 1)}
              disabled={todayPage === totalTodayPages}
            >
              Sau
            </button>
          </div>
        </section>

        {/* 3) Top danh mục chi tiêu (Pie) (Bottom-left) */}
        <section className='card p-4 sm:p-6 h-full'>
          <h2 className='text-base sm:text-lg md:text-xl font-semibold text-primary mb-3 sm:mb-4'>Top danh mục chi tiêu</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center'>
            {/* Pie chart */}
            <div className='flex items-center justify-center'>
              <PieChart data={categories} size={192} radius={14} />
            </div>
            {/* Legend */}
            <div className='space-y-2 sm:space-y-3'>
              {categories.map((c) => (
                <div key={c.label} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='w-3 h-3 rounded-full' style={{ backgroundColor: c.color }} />
                    <span className='text-sm text-secondary'>{c.label}</span>
                  </div>
                  <span className='text-sm font-semibold text-primary'>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4) Tóm tắt báo cáo nhanh (Bottom-right) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div className='card-glass p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>Tổng chi tháng</div>
              <div className='text-lg sm:text-xl font-bold text-primary leading-tight break-words whitespace-normal'>
                {monthTotal.toLocaleString('vi-VN')}₫
              </div>
            </div>
            <div className='card-glass p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>Số giao dịch</div>
              <div className='text-lg sm:text-xl font-bold text-primary leading-tight break-words whitespace-normal'>{txCount}</div>
            </div>
            <div className='card-glass p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>Trung bình/ngày</div>
              <div className='text-lg sm:text-xl font-bold text-primary leading-tight break-words whitespace-normal'>
                {avgPerDay.toLocaleString('vi-VN')}₫
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
