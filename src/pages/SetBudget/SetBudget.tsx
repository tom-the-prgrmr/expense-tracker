import BudgetTable from '@/components/BudgetTable/BudgetTable';
import Button from '@/components/Button/Button';
import ProgressBar from '@/components/Charts/ProgressBar';
import CreateBudgetModal from '@/components/CreateBudgetModal/CreateBudgetModal';
import PeriodSelector, {
  type PeriodType,
} from '@/components/Form/PeriodSelector/PeriodSelector';
import Slider from '@/components/Form/Slider/Slider';
import PageLayout from '@/components/PageLayout/PageLayout';
import { apiFetch, createAlert, fetchAlerts, updateAlert } from '@/config/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useMoneyNoteQueryByTimestamp } from '@/hooks/useMoneyNoteQuery';
import { type AlertsResponse, type CategoriesResponse } from '@/types/api';
import {
  formatCurrencyVND,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  localDateToEndOfDayEpochSeconds,
  localDateToEpochSeconds,
} from '@/utils/date';
import { useQueryClient } from '@tanstack/react-query';
import { type FC, useCallback, useMemo, useState } from 'react';

const SetBudget: FC = () => {
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<{
    type: PeriodType;
    date: string;
  }>({
    type: 'month',
    date: new Date().toISOString().slice(0, 10),
  });
  const [budgetAmount, setBudgetAmount] = useState(5000000);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const date = new Date(selectedPeriod.date);

    switch (selectedPeriod.type) {
      case 'day':
        // For day: pass the selected day to get API
        return {
          start: localDateToEpochSeconds(date),
          end: localDateToEndOfDayEpochSeconds(date),
        };
      case 'month': {
        // For month: pass the current month of selected day to get API
        const firstDay = getFirstDayOfMonth(date);
        const lastDay = getLastDayOfMonth(date);
        return {
          start: localDateToEpochSeconds(firstDay),
          end: localDateToEndOfDayEpochSeconds(lastDay),
        };
      }
      case 'year': {
        // For year: pass the current year of selected day to get API
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const yearEnd = new Date(date.getFullYear(), 11, 31);
        return {
          start: localDateToEpochSeconds(yearStart),
          end: localDateToEndOfDayEpochSeconds(yearEnd),
        };
      }
      default:
        return { start: 0, end: 0 };
    }
  }, [selectedPeriod]);

  // Fetch categories
  const { data: categoriesData } = useApiQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => apiFetch('/api/v1/category?status=2'),
    loadingMessage: 'Đang tải danh mục...',
  });

  // Fetch money notes for the selected period
  const { data: moneyNotesData } = useMoneyNoteQueryByTimestamp(
    dateRange.start,
    dateRange.end,
    {
      enabled: dateRange.start > 0 && dateRange.end > 0,
      loadingMessage: 'Đang tải dữ liệu chi tiêu...',
    }
  );

  // Fetch alerts for the selected period
  const { data: alertsData, refetch: refetchAlerts } =
    useApiQuery<AlertsResponse>({
      queryKey: ['alerts', dateRange.start, dateRange.end],
      queryFn: () => fetchAlerts(dateRange.start, dateRange.end),
      loadingMessage: 'Đang tải hạn mức...',
      enabled: dateRange.start > 0 && dateRange.end > 0,
    });

  const categories = categoriesData?.data || [];
  const alerts = alertsData?.data || [];

  // Calculate total expenses by category
  const expensesByCategory = useMemo(() => {
    const moneyNotes = moneyNotesData?.data || [];
    return moneyNotes.reduce((acc, note) => {
      if (note.type === 1) {
        // expense
        acc[note.category_id] = (acc[note.category_id] || 0) + note.amount;
      }
      return acc;
    }, {} as Record<number, number>);
  }, [moneyNotesData]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return Object.values(expensesByCategory).reduce(
      (sum, amount) => sum + amount,
      0
    );
  }, [expensesByCategory]);

  const handleUpdateAlert = useCallback(
    async (
      alertId: number,
      data: { title: string; amount: number; status: number }
    ) => {
      await updateAlert(alertId, data);
      await refetchAlerts();
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    [refetchAlerts, queryClient]
  );

  const handleDeleteAlert = useCallback(
    async (alertId: number) => {
      await updateAlert(alertId, { title: '', amount: 0, status: 1 }); // status 1 = inactive
      await refetchAlerts();
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    [refetchAlerts, queryClient]
  );

  const handleCreateAlert = useCallback(
    async (data: { categoryId: number; title: string; amount: number }) => {
      const typeMap = { day: 1, month: 2, year: 3 };
      await createAlert({
        category_id: data.categoryId,
        title: data.title,
        amount: data.amount,
        start_date: dateRange.start,
        end_date: dateRange.end,
        type: typeMap[selectedPeriod.type],
      });
      await refetchAlerts();
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    [dateRange, selectedPeriod.type, refetchAlerts, queryClient]
  );

  return (
    <PageLayout
      title='Thiết lập hạn mức'
      icon='🎯'
      subtitle='Đặt giới hạn chi tiêu cho từng danh mục và theo thời gian'
    >
      <div className='space-y-6 lg:space-y-8'>
        {/* Period Selection */}
        <div
          className='rounded-2xl p-4 sm:p-6 shadow-sm border transition-all duration-200'
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <h3
            className='text-base sm:text-lg font-semibold mb-4'
            style={{ color: 'var(--theme-text)' }}
          >
            Chọn khoảng thời gian
          </h3>
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        {/* Budget Configuration */}
        <div
          className='rounded-2xl p-4 sm:p-6 shadow-sm border transition-all duration-200'
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <h3
            className='text-base sm:text-lg font-semibold mb-4'
            style={{ color: 'var(--theme-text)' }}
          >
            Cấu hình hạn mức
          </h3>
          <div className='space-y-4 sm:space-y-6'>
            <Slider
              value={budgetAmount}
              onChange={setBudgetAmount}
              min={100000}
              max={50000000}
              step={100000}
              label='Hạn mức tổng'
              helperText='Kéo thanh trượt để điều chỉnh hạn mức chi tiêu'
            />
            <Button
              variant='primary'
              size='lg'
              fullWidth
              onClick={() => setIsCreateModalOpen(true)}
              className='sm:max-w-xs mx-auto sm:mx-0'
            >
              Tạo hạn mức mới
            </Button>
          </div>
        </div>

        {/* Expense Overview */}
        <div
          className='rounded-2xl p-4 sm:p-6 shadow-sm border transition-all duration-200'
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <h3
            className='text-base sm:text-lg font-semibold mb-4'
            style={{ color: 'var(--theme-text)' }}
          >
            Tổng quan chi tiêu
          </h3>
          <div className='space-y-4'>
            <ProgressBar
              current={totalExpenses}
              total={budgetAmount}
              label='Tổng chi tiêu'
              showValues={true}
              showPercentage={true}
              color={totalExpenses > budgetAmount ? 'danger' : 'primary'}
              size='lg'
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm'>
              <div className='flex justify-between sm:block'>
                <span style={{ color: 'var(--theme-text-secondary)' }}>
                  Đã chi:{' '}
                </span>
                <span
                  className='font-semibold ml-2 sm:ml-0'
                  style={{ color: 'var(--theme-text)' }}
                >
                  {formatCurrencyVND(totalExpenses)}
                </span>
              </div>
              <div className='flex justify-between sm:block'>
                <span style={{ color: 'var(--theme-text-secondary)' }}>
                  Còn lại:{' '}
                </span>
                <span
                  className='font-semibold ml-2 sm:ml-0'
                  style={{ color: 'var(--theme-text)' }}
                >
                  {formatCurrencyVND(Math.max(0, budgetAmount - totalExpenses))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Management Table */}
        <div
          className='rounded-2xl p-4 sm:p-6 shadow-sm border transition-all duration-200'
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <h3
            className='text-base sm:text-lg font-semibold mb-4'
            style={{ color: 'var(--theme-text)' }}
          >
            Quản lý hạn mức theo danh mục
          </h3>
          <BudgetTable
            alerts={alerts}
            categories={categories}
            expenses={expensesByCategory}
            onUpdate={handleUpdateAlert}
            onDelete={handleDeleteAlert}
          />
        </div>
      </div>

      {/* Create Budget Modal */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        onCreate={handleCreateAlert}
      />
    </PageLayout>
  );
};

export default SetBudget;
