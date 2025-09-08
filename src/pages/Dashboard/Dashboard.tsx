
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
        <section className='bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100 h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4'>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${withinLimit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <span className='text-lg'>{withinLimit ? '✅' : '⚠️'}</span>
              {withinLimit ? 'Trong hạn mức' : 'Quá hạn mức'}
            </div>
            <div className='text-sm text-gray-500'>
              Hạn mức: <span className='font-semibold text-gray-900 leading-tight'>{limitAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center'>
            {/* Radial progress */}
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <RadialProgress percent={spentPercent} size={160} barColor={withinLimit ? '#22C55E' : '#EF4444'} />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className='text-[11px] sm:text-xs text-gray-500 mb-1'>Đã chi</div>
                  <div className='text-base sm:text-lg font-bold text-gray-900 leading-tight text-center'>
                    {spentToday.toLocaleString('vi-VN')}₫
                  </div>
                  <div className='text-[10px] sm:text-[11px] text-gray-500'>
                    {spentPercent.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Figures (first two fixed on same row) */}
            <div className='md:col-span-2 flex flex-col gap-3 sm:gap-4'>
              <div className='flex gap-3 sm:gap-4 w-full'>
                <div className='rounded-xl bg-gray-50 p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-gray-500 mb-1'>Hạn mức</div>
                  <div className='text-base sm:text-lg font-bold text-gray-900 leading-tight'>
                    {limitAmount.toLocaleString('vi-VN')}₫
                  </div>
                </div>
                <div className='rounded-xl bg-gray-50 p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-gray-500 mb-1'>Đã chi</div>
                  <div className='text-base sm:text-lg font-bold text-gray-900 leading-tight'>
                    {spentToday.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
              <div className='rounded-xl bg-gray-50 p-3 sm:p-4 w-full'>
                <div className='text-xs text-gray-500 mb-1'>Còn lại</div>
                <div className={`text-base sm:text-lg font-bold leading-tight ${withinLimit ? 'text-green-600' : 'text-red-600'}`}>
                  {remaining.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2) Chi tiêu hôm nay (Top-right) */}
        <section className='bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100 h-full'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-gray-900'>Chi tiêu hôm nay</h2>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='text-xs sm:text-sm text-gray-600'>
                Tổng: <span className='font-semibold text-gray-900 leading-tight'>{todayList.reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')}₫</span>
              </div>
              <button className='px-2.5 py-1.5 sm:px-3 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm hover:bg-indigo-700'>
                + Thêm chi tiêu
              </button>
            </div>
          </div>
          <div className='divide-y divide-gray-100'>
            {pagedTodayList.map((e) => (
              <div key={e.id} className='flex items-center justify-between py-2.5 sm:py-3'>
                <div className='flex items-center gap-3'>
                  <div className='text-[11px] sm:text-xs text-gray-500 w-12'>{e.time}</div>
                  <div className='text-sm font-medium text-gray-900'>{e.title}</div>
                </div>
                <div className='text-sm font-semibold text-gray-900 leading-tight text-right'>
                  {e.amount.toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className='flex items-center justify-between pt-3'>
            <button
              className='px-3 py-1.5 rounded-md border text-sm disabled:opacity-50'
              onClick={() => goTodayPage(todayPage - 1)}
              disabled={todayPage === 1}
            >
              Trước
            </button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: totalTodayPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-md text-sm border ${p === todayPage ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
                  onClick={() => goTodayPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className='px-3 py-1.5 rounded-md border text-sm disabled:opacity-50'
              onClick={() => goTodayPage(todayPage + 1)}
              disabled={todayPage === totalTodayPages}
            >
              Sau
            </button>
          </div>
        </section>

        {/* 3) Top danh mục chi tiêu (Pie) (Bottom-left) */}
        <section className='bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100 h-full'>
          <h2 className='text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4'>Top danh mục chi tiêu</h2>
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
                    <span className='text-sm text-gray-700'>{c.label}</span>
                  </div>
                  <span className='text-sm font-semibold text-gray-900'>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4) Tóm tắt báo cáo nhanh (Bottom-right) */}
        <section className='bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100 h-full'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div className='rounded-xl bg-gray-50 p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-gray-500 mb-1 break-words whitespace-normal'>Tổng chi tháng</div>
              <div className='text-lg sm:text-xl font-bold text-gray-900 leading-tight break-words whitespace-normal'>
                {monthTotal.toLocaleString('vi-VN')}₫
              </div>
            </div>
            <div className='rounded-xl bg-gray-50 p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-gray-500 mb-1 break-words whitespace-normal'>Số giao dịch</div>
              <div className='text-lg sm:text-xl font-bold text-gray-900 leading-tight break-words whitespace-normal'>{txCount}</div>
            </div>
            <div className='rounded-xl bg-gray-50 p-3 sm:p-6 min-w-0'>
              <div className='text-xs text-gray-500 mb-1 break-words whitespace-normal'>Trung bình/ngày</div>
              <div className='text-lg sm:text-xl font-bold text-gray-900 leading-tight break-words whitespace-normal'>
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
