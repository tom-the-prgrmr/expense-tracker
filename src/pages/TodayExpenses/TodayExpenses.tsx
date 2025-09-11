import Button from '@/components/Button/Button';
import DataTable, { type Column } from '@/components/DataTable/DataTable';
import DatePicker from '@/components/Form/DatePicker/DatePicker';
import PageLayout from '@/components/PageLayout/PageLayout';
import { apiFetch } from '@/config/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { type MoneyNoteDto, type MoneyNotesResponse } from '@/types/api';
import {
  formatCurrencyVND,
  formatDateLocalYYYYMMDD,
  localDateToEndOfDayEpochSeconds,
  localDateToEpochSeconds,
  parseEpochSecondsOrIsoToDate,
} from '@/utils/date';
import { type FC, useCallback, useMemo, useState } from 'react';

const TodayExpenses: FC = () => {
  const today = useMemo(() => new Date(), []);
  const [startInput, setStartInput] = useState<string>(
    formatDateLocalYYYYMMDD(today)
  );
  const [endInput, setEndInput] = useState<string>(
    formatDateLocalYYYYMMDD(today)
  );

  // Applied range used by the query
  const [appliedStart, setAppliedStart] = useState<number>(
    localDateToEpochSeconds(today)
  );
  const [appliedEnd, setAppliedEnd] = useState<number>(
    localDateToEndOfDayEpochSeconds(today)
  );

  const onSearch = useCallback(() => {
    const start = new Date(startInput);
    const end = new Date(endInput);
    // Normalize and guard
    if (end < start) {
      // If invalid range, swap
      const tmp = startInput;
      setStartInput(endInput);
      setEndInput(tmp);
      setAppliedStart(localDateToEpochSeconds(end));
      setAppliedEnd(localDateToEndOfDayEpochSeconds(start));
      return;
    }
    setAppliedStart(localDateToEpochSeconds(start));
    setAppliedEnd(localDateToEndOfDayEpochSeconds(end));
  }, [startInput, endInput]);

  const { data, isLoading, isError, error } = useApiQuery({
    queryKey: ['today-money-notes', appliedStart, appliedEnd],
    queryFn: async () => {
      try {
        return await apiFetch<MoneyNotesResponse>(
          `/api/v1/money-note?start_date=${appliedStart}&end_date=${appliedEnd}&category_id=2`
        );
      } catch (err) {
        if (err instanceof Error) {
          let errorMessage = 'Không thể tải dữ liệu chi tiêu hôm nay.';
          try {
            const errorData = JSON.parse(err.message);
            if (errorData.detail?.message) {
              errorMessage = errorData.detail.message;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch {
            errorMessage =
              err.message.length < 200
                ? err.message
                : 'Lỗi không xác định từ API.';
          }
          throw new Error(errorMessage);
        }
        throw err as unknown as Error;
      }
    },
    loadingMessage: 'Đang tải chi tiêu hôm nay...',
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  const items: MoneyNoteDto[] = data?.data ?? [];

  return (
    <PageLayout
      title='Dữ liệu chi tiêu'
      icon='📅'
      subtitle='Xem và quản lý các khoản chi tiêu trong ngày'
    >
      {/* Filters outside the table/card */}
      <div className='mb-4 px-1 sm:px-0'>
        <div className='flex flex-col sm:flex-row gap-3 sm:items-end'>
          <DatePicker
            id='start-date'
            label='Từ ngày'
            value={startInput}
            max={endInput}
            onChange={setStartInput}
            className='sm:w-48'
          />
          <DatePicker
            id='end-date'
            label='Đến ngày'
            value={endInput}
            min={startInput}
            onChange={setEndInput}
            className='sm:w-48'
          />
          <div className='sm:ml-auto'>
            <Button
              onClick={onSearch}
              variant='primary'
              size='md'
              leadingIcon={'🔎'}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800'>
        <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
            Danh sách chi tiêu
          </h3>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Hôm nay
          </span>
        </div>

        {isError ? (
          <div className='p-6 text-red-600 dark:text-red-400'>
            {(error as Error)?.message ?? 'Đã xảy ra lỗi.'}
          </div>
        ) : (
          <div className='p-2'>
            <DataTable
              columns={
                [
                  {
                    key: 'time',
                    header: 'Thời gian',
                    align: 'left',
                    render: (row) => {
                      const r = row as unknown as MoneyNoteDto;
                      const date = parseEpochSecondsOrIsoToDate(r.date);
                      const time = `${String(date.getHours()).padStart(
                        2,
                        '0'
                      )}:${String(date.getMinutes()).padStart(2, '0')}`;
                      return <span>{time}</span>;
                    },
                  },
                  {
                    key: 'note',
                    header: 'Ghi chú',
                    align: 'left',
                    render: (row) => {
                      const r = row as unknown as MoneyNoteDto;
                      return <span>{r.note || '—'}</span>;
                    },
                  },
                  {
                    key: 'amount',
                    header: 'Số tiền',
                    align: 'right',
                    render: (row) => {
                      const r = row as unknown as MoneyNoteDto;
                      return (
                        <span className='font-medium'>
                          {formatCurrencyVND(r.amount)}
                        </span>
                      );
                    },
                  },
                ] as Column<MoneyNoteDto>[]
              }
              data={items}
              isLoading={isLoading}
              rowKey={(row) => (row as MoneyNoteDto).id}
              emptyState={
                <div className='flex flex-col items-center justify-center gap-2 text-center'>
                  <div className='text-3xl'>🗒️</div>
                  <div
                    className='text-sm font-medium'
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Không có dữ liệu chi tiêu
                  </div>
                  <div
                    className='text-xs'
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    Hãy thêm khoản chi tiêu mới để bắt đầu theo dõi.
                  </div>
                </div>
              }
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TodayExpenses;
