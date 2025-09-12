import PieChart from '@/components/Charts/PieChart';
import RadialProgress from '@/components/Charts/RadialProgress';
import PageLayout from '@/components/PageLayout/PageLayout';
import { apiFetch } from '@/config/api';
import { PIE_CHART_COLORS } from '@/constants/charts';
import { useApiQuery } from '@/hooks/useApiQuery';
import {
  type CategoriesResponse,
  type CategoryDto,
  type MoneyNoteDto,
  type MoneyNotesResponse,
} from '@/types/api';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  localDateToEndOfDayEpochSeconds,
  localDateToEpochSeconds,
  parseEpochSecondsOrIsoToDate,
} from '@/utils/date';
import { type FC, useMemo, useState } from 'react';

type MoneyNote = MoneyNoteDto;

const Dashboard: FC = () => {
  // Placeholder data; replace with real data later
  const limitAmount = 5000000; // hạn mức ngày (VND)
  const spentToday = 1200000; // đã chi hôm nay
  const remaining = Math.max(limitAmount - spentToday, 0);
  const withinLimit = spentToday <= limitAmount;
  const spentPercent = Math.min((spentToday / limitAmount) * 100, 100);

  // Today range converted to timestamps for API
  const today = useMemo(() => new Date(), []);
  const startDate = localDateToEpochSeconds(today);
  const endDate = localDateToEndOfDayEpochSeconds(today);

  // Fetch today's expenses
  const {
    data: moneyNotesData,
    isLoading: isLoadingToday,
    isError: isErrorToday,
    error: todayError,
  } = useApiQuery({
    queryKey: ['money-notes', startDate, endDate],
    queryFn: async () => {
      try {
        return await apiFetch<MoneyNotesResponse>(
          `/api/v1/money-note?start_date=${startDate}&end_date=${endDate}`
        );
      } catch (error) {
        // Try to parse error message from API response
        if (error instanceof Error) {
          let errorMessage = 'Không thể tải dữ liệu chi tiêu hôm nay.';
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.detail?.message) {
              errorMessage = errorData.detail.message;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch {
            errorMessage =
              error.message.length < 200
                ? error.message
                : 'Lỗi không xác định từ API.';
          }
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    loadingMessage: 'Đang tải chi tiêu hôm nay...',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 1,
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useApiQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await apiFetch<CategoriesResponse>('/api/v1/category');
      } catch (error) {
        if (error instanceof Error) {
          let errorMessage = 'Không thể tải danh mục.';
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.detail?.message) {
              errorMessage = errorData.detail.message;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch {
            errorMessage =
              error.message.length < 200
                ? error.message
                : 'Lỗi không xác định từ API.';
          }
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    loadingMessage: 'Đang tải danh mục...',
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 1,
  });

  // Fetch monthly money notes for category percentage calculation
  const firstDayOfMonth = getFirstDayOfMonth(today);
  const lastDayOfMonth = getLastDayOfMonth(today);
  const monthlyStartDate = localDateToEpochSeconds(firstDayOfMonth);
  const monthlyEndDate = localDateToEndOfDayEpochSeconds(lastDayOfMonth);

  const {
    data: monthlyMoneyNotesData,
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
    error: monthlyError,
  } = useApiQuery({
    queryKey: ['monthly-money-notes', monthlyStartDate, monthlyEndDate],
    queryFn: async () => {
      try {
        return await apiFetch<MoneyNotesResponse>(
          `/api/v1/money-note?start_date=${monthlyStartDate}&end_date=${monthlyEndDate}`
        );
      } catch (error) {
        if (error instanceof Error) {
          let errorMessage = 'Không thể tải dữ liệu chi tiêu tháng.';
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.detail?.message) {
              errorMessage = errorData.detail.message;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch {
            errorMessage =
              error.message.length < 200
                ? error.message
                : 'Lỗi không xác định từ API.';
          }
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    loadingMessage: 'Đang tải dữ liệu chi tiêu tháng...',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 1,
  });

  type TodayItem = { id: string; time: string; title: string; amount: number };
  const todayList: TodayItem[] = useMemo(() => {
    const raw = Array.isArray(moneyNotesData?.data)
      ? (moneyNotesData!.data as MoneyNote[])
      : [];

    return raw.map((it: MoneyNote, idx: number) => {
      const dt = parseEpochSecondsOrIsoToDate(it.date ?? it.created_at ?? 0);
      const hh = String(dt.getHours()).padStart(2, '0');
      const mm = String(dt.getMinutes()).padStart(2, '0');
      const title = it.note || 'Chi tiêu';
      const amount = Number(it.amount ?? 0) || 0;
      return {
        id: String(it.id ?? idx),
        time: `${hh}:${mm}`,
        title,
        amount,
      };
    });
  }, [moneyNotesData]);

  // Pagination for Today Expenses
  const [todayPage, setTodayPage] = useState(1);
  const pageSize = 4;
  const totalTodayPages = Math.max(1, Math.ceil(todayList.length / pageSize));
  const startIdx = (todayPage - 1) * pageSize;
  const pagedTodayList = todayList.slice(startIdx, startIdx + pageSize);
  const goTodayPage = (p: number) =>
    setTodayPage(Math.min(Math.max(1, p), totalTodayPages));

  // Generate pie chart data from categories API with real percentage calculation
  const categories = useMemo(() => {
    if (!categoriesData?.data || !Array.isArray(categoriesData.data)) {
      return [];
    }

    // Get monthly expense data
    const monthlyExpenses = Array.isArray(monthlyMoneyNotesData?.data)
      ? (monthlyMoneyNotesData!.data as MoneyNote[])
      : [];

    // Filter expenses by type (assuming type 1 = expense)
    const expenses = monthlyExpenses.filter((note) => note.type === 1);

    // Calculate total expense amount
    const totalExpenseAmount = expenses.reduce(
      (sum, note) => sum + (note.amount || 0),
      0
    );

    // If no expenses, return categories with 0%
    if (totalExpenseAmount === 0) {
      return categoriesData.data.map(
        (category: CategoryDto, index: number) => ({
          label: category.name,
          value: 0,
          color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        })
      );
    }

    // Calculate amount per category_id (from money notes)
    const categoryAmounts = new Map<number, number>();
    expenses.forEach((expense) => {
      const categoryId = expense.category_id;
      const amount = expense.amount || 0;
      categoryAmounts.set(
        categoryId,
        (categoryAmounts.get(categoryId) || 0) + amount
      );
    });

    // Map categories to pie chart data, matching category.id with category_id from expenses
    return categoriesData.data.map((category: CategoryDto, index: number) => {
      // Match category.id with category_id from money notes
      const categoryAmount = categoryAmounts.get(category.id) || 0;
      const percentage =
        totalExpenseAmount > 0
          ? (categoryAmount / totalExpenseAmount) * 100
          : 0;

      return {
        label: category.name,
        value: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      };
    });
  }, [categoriesData, monthlyMoneyNotesData]);

  // Calculate monthly summary data from API
  const monthlySummary = useMemo(() => {
    const monthlyExpenses = Array.isArray(monthlyMoneyNotesData?.data)
      ? (monthlyMoneyNotesData!.data as MoneyNote[])
      : [];

    // Filter expenses by type (assuming type 1 = expense)
    const expenses = monthlyExpenses.filter((note) => note.type === 1);

    // Calculate total expense amount for the month
    const monthTotal = expenses.reduce(
      (sum, note) => sum + (note.amount || 0),
      0
    );

    // Count total transactions (all money notes, not just expenses)
    const txCount = monthlyExpenses.length;

    // Calculate average per day (total expenses / number of days in month)
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const avgPerDay =
      daysInMonth > 0 ? Math.round(monthTotal / daysInMonth) : 0;

    return {
      monthTotal,
      txCount,
      avgPerDay,
    };
  }, [monthlyMoneyNotesData, today]);

  return (
    <PageLayout
      title='Dashboard'
      icon='📊'
      subtitle='Tổng quan hạn mức, chi tiêu hôm nay, top danh mục và báo cáo nhanh'
    >
      {/* 2x2 corners on md+, stacked on mobile */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 xl:gap-8'>
        {/* 1) Tổng quan hạn mức và số dư trong ngày (Top-left) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6'>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                withinLimit
                  ? 'bg-gradient-to-r from-accent-green/20 to-accent-green/10 text-accent-green border border-accent-green/30'
                  : 'bg-gradient-to-r from-accent-red/20 to-accent-red/10 text-accent-red border border-accent-red/30'
              }`}
            >
              <span className='text-lg'>{withinLimit ? '✅' : '⚠️'}</span>
              {withinLimit ? 'Trong hạn mức' : 'Quá hạn mức'}
            </div>
            <div className='text-sm text-secondary'>
              Hạn mức:{' '}
              <span className='font-bold text-primary text-gradient'>
                {limitAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center'>
            {/* Radial progress */}
            <div className='flex items-center justify-center'>
              <div className='relative'>
                <RadialProgress
                  percent={spentPercent}
                  size={160}
                  barColor={withinLimit ? '#10b981' : '#ef4444'}
                />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className='text-[11px] sm:text-xs text-muted mb-1'>
                    Đã chi
                  </div>
                  <div className='text-base sm:text-lg font-bold text-primary text-gradient leading-tight text-center'>
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
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full'>
                <div className='card-glass p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-muted mb-1'>Hạn mức</div>
                  <div className='text-base sm:text-lg font-bold text-primary text-gradient leading-tight'>
                    {limitAmount.toLocaleString('vi-VN')}₫
                  </div>
                </div>
                <div className='card-glass p-3 sm:p-4 flex-1'>
                  <div className='text-xs text-muted mb-1'>Đã chi</div>
                  <div className='text-base sm:text-lg font-bold text-primary text-gradient leading-tight'>
                    {spentToday.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
              <div className='card-glass p-3 sm:p-4 w-full'>
                <div className='text-xs text-muted mb-1'>Còn lại</div>
                <div
                  className={`text-base sm:text-lg font-bold leading-tight ${
                    withinLimit ? 'text-accent-green' : 'text-accent-red'
                  }`}
                >
                  {remaining.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2) Chi tiêu hôm nay (Top-right) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-3 sm:mb-4'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-primary'>
              Chi tiêu hôm nay
            </h2>
            <div className='flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0 justify-between w-full sm:w-auto sm:justify-start'>
              <div className='text-xs sm:text-sm text-secondary'>
                Tổng:{' '}
                <span className='font-bold text-primary text-gradient leading-tight'>
                  {todayList
                    .reduce((a, b) => a + b.amount, 0)
                    .toLocaleString('vi-VN')}
                  ₫
                </span>
              </div>
              <button className='btn-primary px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm'>
                + Thêm chi tiêu
              </button>
            </div>
          </div>
          <div className='divide-y divide-white/10'>
            {isLoadingToday ? (
              <div className='py-3 text-sm text-muted'>
                Đang tải chi tiêu hôm nay...
              </div>
            ) : isErrorToday ? (
              <div className='py-3 text-sm text-accent-red'>
                {todayError?.message ||
                  'Không thể tải dữ liệu chi tiêu hôm nay.'}
              </div>
            ) : pagedTodayList.length === 0 ? (
              <div className='py-3 text-sm text-muted'>
                Chưa có chi tiêu nào hôm nay.
              </div>
            ) : (
              pagedTodayList.map((e) => (
                <div
                  key={e.id}
                  className='flex items-center justify-between py-2.5 sm:py-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='text-[11px] sm:text-xs text-muted w-12'>
                      {e.time}
                    </div>
                    <div className='text-sm font-medium text-primary'>
                      {e.title}
                    </div>
                  </div>
                  <div className='text-sm font-bold text-primary text-gradient leading-tight text-right'>
                    {e.amount.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))
            )}
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
              {Array.from({ length: totalTodayPages }, (_, i) => i + 1).map(
                (p) => (
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
                )
              )}
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
          <h2 className='text-base sm:text-lg md:text-xl font-semibold text-primary mb-3 sm:mb-4'>
            Top danh mục chi tiêu
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center'>
            {isLoadingCategories || isLoadingMonthly ? (
              <div className='col-span-2 flex items-center justify-center py-8'>
                <div className='text-sm text-muted'>Đang tải dữ liệu...</div>
              </div>
            ) : isErrorCategories ? (
              <div className='col-span-2 flex items-center justify-center py-8'>
                <div className='text-sm text-accent-red'>
                  {categoriesError?.message || 'Không thể tải danh mục.'}
                </div>
              </div>
            ) : isErrorMonthly ? (
              <div className='col-span-2 flex items-center justify-center py-8'>
                <div className='text-sm text-accent-red'>
                  {monthlyError?.message ||
                    'Không thể tải dữ liệu chi tiêu tháng.'}
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className='col-span-2 flex items-center justify-center py-8'>
                <div className='text-sm text-muted'>Chưa có danh mục nào.</div>
              </div>
            ) : (
              <>
                {/* Pie chart */}
                <div className='flex items-center justify-center'>
                  <PieChart data={categories} size={192} radius={14} />
                </div>
                {/* Legend */}
                <div className='space-y-2 sm:space-y-3'>
                  {categories.map((c) => (
                    <div
                      key={c.label}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-3'>
                        <span
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: c.color }}
                        />
                        <span className='text-sm text-secondary'>
                          {c.label}
                        </span>
                      </div>
                      <span className='text-sm font-semibold text-primary'>
                        {c.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 4) Tóm tắt báo cáo nhanh (Bottom-right) */}
        <section className='card p-4 sm:p-6 h-full'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div className='card-glass p-3 sm:p-6 min-w-0 text-center sm:text-left'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>
                Tổng chi tháng
              </div>
              <div className='text-lg sm:text-xl font-bold text-primary text-gradient leading-tight break-words whitespace-normal'>
                {monthlySummary.monthTotal.toLocaleString('vi-VN')}₫
              </div>
            </div>
            <div className='card-glass p-3 sm:p-6 min-w-0 text-center sm:text-left'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>
                Số giao dịch
              </div>
              <div className='text-lg sm:text-xl font-bold text-primary leading-tight break-words whitespace-normal'>
                {monthlySummary.txCount}
              </div>
            </div>
            <div className='card-glass p-3 sm:p-6 min-w-0 text-center sm:text-left'>
              <div className='text-xs text-muted mb-1 break-words whitespace-normal'>
                Trung bình/ngày
              </div>
              <div className='text-lg sm:text-xl font-bold text-primary text-gradient leading-tight break-words whitespace-normal'>
                {monthlySummary.avgPerDay.toLocaleString('vi-VN')}₫
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
