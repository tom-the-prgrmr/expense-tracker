import Button from '@/components/Button/Button';
import DataTable, { type Column } from '@/components/DataTable/DataTable';
import DatePicker from '@/components/Form/DatePicker/DatePicker';
import Dropdown, {
  type DropdownOption,
} from '@/components/Form/Dropdown/Dropdown';
import TextInput from '@/components/Form/TextInput/TextInput';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useToast } from '@/components/Toast/useToast';
import { apiFetch } from '@/config/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import {
  type CategoriesResponse,
  type CategoryDto,
  type MoneyNoteDto,
  type MoneyNotesResponse,
} from '@/types/api';
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

  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: ['today-money-notes', appliedStart, appliedEnd],
    queryFn: async () => {
      try {
        return await apiFetch<MoneyNotesResponse>(
          `/api/v1/money-note?start_date=${appliedStart}&end_date=${appliedEnd}&status=2`
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 1,
  });

  const items: MoneyNoteDto[] = data?.data ?? [];

  // Modal state for creating expense notes (support multiple rows)
  const [isModalOpen, setIsModalOpen] = useState(false);
  type DraftNote = { note: string; amount: string; categoryId: number | '' };
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Edit modal state for updating a single expense row
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MoneyNoteDto | null>(null);
  const [editNote, setEditNote] = useState<string>('');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editCategoryId, setEditCategoryId] = useState<number | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch categories for dropdown (active only)
  const { data: categoriesData } = useApiQuery({
    queryKey: ['categories-active'],
    queryFn: async () => {
      return await apiFetch<CategoriesResponse>('/api/v1/category?status=2');
    },
    loadingMessage: undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
    enabled: isModalOpen,
  });

  const categoryOptions: DropdownOption[] = useMemo(() => {
    const list: CategoryDto[] = categoriesData?.data ?? [];
    return list
      .filter((c) => c.type === 1)
      .map((c) => ({ value: c.id, label: c.name }));
  }, [categoriesData]);

  const openModal = useCallback(() => {
    setDraftNotes([{ note: '', amount: '', categoryId: '' as never }]);
    setFormError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isSaving) return; // prevent closing while saving
    setIsModalOpen(false);
  }, [isSaving]);

  const openEdit = useCallback((row: MoneyNoteDto) => {
    setEditTarget(row);
    setEditNote(row.note || '');
    setEditAmount(String(row.amount ?? ''));
    setEditCategoryId(row.category_id ?? '');
    setIsEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    if (isUpdating) return;
    setIsEditOpen(false);
    setEditTarget(null);
  }, [isUpdating]);

  const onDelete = useCallback(
    async (row: MoneyNoteDto) => {
      const confirmed = window.confirm(
        'Bạn có chắc muốn xóa khoản chi tiêu này?'
      );
      if (!confirmed) return;
      try {
        await apiFetch<unknown>(`/api/v1/money-note/${row.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            note: row.note,
            amount: row.amount,
            category_id: row.category_id,
            status: 1,
          }),
        });
        toast.showSuccess('Đã xóa khoản chi tiêu');
        await refetch();
      } catch (err) {
        let message = 'Không thể xóa khoản chi tiêu.';
        if (err instanceof Error && err.message) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.message) message = parsed.message;
          } catch {
            message = err.message;
          }
        }
        toast.showError(message);
      }
    },
    [refetch, toast]
  );

  const onUpdate = useCallback(async () => {
    if (!editTarget) return;
    const note = editNote.trim();
    const amountNum = Number(editAmount);
    if (!note) {
      toast.showError('Ghi chú không được để trống.');
      return;
    }
    if (!editAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.showError('Số tiền phải là số dương.');
      return;
    }
    if (!editCategoryId) {
      toast.showError('Vui lòng chọn danh mục.');
      return;
    }
    setIsUpdating(true);
    try {
      await apiFetch<unknown>(`/api/v1/money-note/${editTarget.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          note,
          amount: amountNum,
          category_id: editCategoryId as number,
        }),
      });
      toast.showSuccess('Cập nhật khoản chi tiêu thành công');
      setIsEditOpen(false);
      setEditTarget(null);
      await refetch();
    } catch (err) {
      let message = 'Không thể cập nhật khoản chi tiêu.';
      if (err instanceof Error && err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.message) message = parsed.message;
        } catch {
          message = err.message;
        }
      }
      toast.showError(message);
    } finally {
      setIsUpdating(false);
    }
  }, [editTarget, editNote, editAmount, editCategoryId, toast, refetch]);

  const onSave = useCallback(async () => {
    // Validate all rows
    if (!draftNotes.length) {
      setFormError('Vui lòng thêm ít nhất một dòng.');
      return;
    }
    const payload: Array<{
      type: number;
      note: string;
      amount: number;
      category_id: number;
    }> = [];
    for (let i = 0; i < draftNotes.length; i++) {
      const row = draftNotes[i];
      const note = row.note.trim();
      const amountNum = Number(row.amount);
      if (!note) {
        setFormError(`Dòng ${i + 1}: Ghi chú không được để trống.`);
        return;
      }
      if (!row.amount || Number.isNaN(amountNum) || amountNum <= 0) {
        setFormError(`Dòng ${i + 1}: Số tiền phải là số dương.`);
        return;
      }
      if (!row.categoryId) {
        setFormError(`Dòng ${i + 1}: Vui lòng chọn danh mục.`);
        return;
      }
      payload.push({
        type: 1,
        note,
        amount: amountNum,
        category_id: row.categoryId as number,
      });
    }

    setFormError(null);

    setIsSaving(true);
    try {
      await apiFetch<MoneyNotesResponse>('/api/v1/money-note', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.showSuccess('Thêm khoản chi tiêu thành công');
      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      let message = 'Không thể lưu khoản chi tiêu.';
      if (err instanceof Error && err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.message) message = parsed.message;
        } catch {
          message = err.message;
        }
      }
      setFormError(message);
      toast.showError(message);
    } finally {
      setIsSaving(false);
    }
  }, [draftNotes, toast, refetch]);

  const updateRow = useCallback(
    (index: number, field: keyof DraftNote, value: string | number) => {
      setDraftNotes((prev) => {
        const next = [...prev];
        const row = { ...next[index] };
        if (field === 'categoryId') {
          row.categoryId = Number(value) as number;
        } else if (field === 'amount') {
          row.amount = String(value);
        } else if (field === 'note') {
          row.note = String(value);
        }
        next[index] = row;
        return next;
      });
    },
    []
  );

  const addRow = useCallback(() => {
    setDraftNotes((prev) => [
      ...prev,
      { note: '', amount: '', categoryId: '' as never },
    ]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setDraftNotes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <PageLayout
      title='Dữ liệu chi tiêu'
      icon='📅'
      subtitle='Xem và quản lý các khoản chi tiêu'
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
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Hôm nay
            </span>
            <Button
              onClick={openModal}
              variant='primary'
              size='sm'
              leadingIcon={'＋'}
            >
              Thêm chi tiêu
            </Button>
          </div>
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
                      const dateStr = formatDateLocalYYYYMMDD(date);
                      return <span>{`${dateStr} ${time}`}</span>;
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
                    key: 'created_at',
                    header: 'Ngày tạo',
                    align: 'left',
                    render: (row) => {
                      const r = row as unknown as MoneyNoteDto;
                      const createdDate = parseEpochSecondsOrIsoToDate(
                        r.created_at
                      );
                      return (
                        <span>{formatDateLocalYYYYMMDD(createdDate)}</span>
                      );
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
                  {
                    key: 'actions',
                    header: '',
                    align: 'left',
                    render: (row) => {
                      const r = row as unknown as MoneyNoteDto;
                      return (
                        <div className='flex items-center gap-2'>
                          <button
                            className='px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-500'
                            onClick={() => openEdit(r)}
                            title='Cập nhật'
                          >
                            Sửa
                          </button>
                          <button
                            className='px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-500'
                            onClick={() => onDelete(r)}
                            title='Xóa'
                          >
                            Xóa
                          </button>
                        </div>
                      );
                    },
                  },
                ] as Column<MoneyNoteDto>[]
              }
              data={items}
              enablePagination={true}
              pageSize={20}
              showPaginationInfo={true}
              showPageSizeDropdown={true}
              pageSizeOptions={[10, 20, 50, 100]}
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

      {isModalOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 modal-backdrop'
            onClick={closeModal}
          />
          <div className='relative z-10 w-full max-w-lg mx-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[50vh] flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800'>
              <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                Thêm khoản chi tiêu
              </h4>
              <button
                aria-label='Đóng'
                className='text-xl px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className='px-5 py-4 space-y-4 overflow-y-auto min-h-0 flex-1'>
              {draftNotes.map((row, idx) => (
                <div
                  key={idx}
                  className='rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted'>Dòng {idx + 1}</span>
                    {draftNotes.length > 1 ? (
                      <button
                        type='button'
                        className='text-sm text-red-500 hover:text-red-400'
                        onClick={() => removeRow(idx)}
                      >
                        Xóa
                      </button>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor={`note-input-${idx}`}
                      className='block mb-1.5 text-sm font-medium text-secondary'
                    >
                      Ghi chú<span className='text-accent-red ml-1'>*</span>
                    </label>
                    <textarea
                      id={`note-input-${idx}`}
                      value={row.note}
                      onChange={(e) => updateRow(idx, 'note', e.target.value)}
                      placeholder='Ví dụ: đi chợ mua cá'
                      className={
                        `w-full px-3.5 py-2.5 rounded-xl outline-none transition-colors ` +
                        `bg-white text-gray-900 ` +
                        `dark:bg-[var(--theme-surface-secondary,#334155)] dark:text-[var(--theme-text,#ffffff)] ` +
                        `placeholder:text-gray-400 dark:placeholder:text-[var(--theme-text-muted,#94a3b8)] ` +
                        `border border-gray-300 dark:border-[var(--theme-border,#475569)] ` +
                        `focus:border-[var(--theme-primary,#3b82f6)] ` +
                        `max-h-32 overflow-y-auto`
                      }
                      rows={3}
                    />
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <TextInput
                      id={`amount-input-${idx}`}
                      label='Số tiền'
                      type='number'
                      inputMode='numeric'
                      className='no-spinner'
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(
                          idx,
                          'amount',
                          e.target.value.replace(/[^0-9]/g, '')
                        )
                      }
                      placeholder='Ví dụ: 100000'
                      required
                    />
                    <Dropdown
                      id={`category-select-${idx}`}
                      label='Danh mục'
                      options={categoryOptions}
                      className='dropdown-rounded'
                      value={row.categoryId as number | ''}
                      onChange={(e) =>
                        updateRow(idx, 'categoryId', Number(e.target.value))
                      }
                      placeholder='Chọn danh mục'
                      required
                    />
                  </div>
                </div>
              ))}
              <div className='flex justify-between items-center'>
                {formError ? (
                  <p className='text-accent-red text-sm'>{formError}</p>
                ) : (
                  <span />
                )}
                <Button variant='secondary' size='sm' onClick={addRow}>
                  + Thêm dòng
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-800'>
              <Button
                variant='secondary'
                onClick={closeModal}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button variant='primary' onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isEditOpen && editTarget ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 modal-backdrop'
            onClick={closeEdit}
          />
          <div className='relative z-10 w-full max-w-lg mx-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[50vh] flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800'>
              <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                Cập nhật khoản chi tiêu
              </h4>
              <button
                aria-label='Đóng'
                className='text-xl px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                onClick={closeEdit}
              >
                ×
              </button>
            </div>
            <div className='px-5 py-4 space-y-4 overflow-y-auto min-h-0 flex-1'>
              <div>
                <label className='block mb-1.5 text-sm font-medium text-secondary'>
                  Ghi chú<span className='text-accent-red ml-1'>*</span>
                </label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder='Ví dụ: đi chợ mua cá'
                  className={
                    `w-full px-3.5 py-2.5 rounded-xl outline-none transition-colors ` +
                    `bg-white text-gray-900 ` +
                    `dark:bg-[var(--theme-surface-secondary,#334155)] dark:text-[var(--theme-text,#ffffff)] ` +
                    `placeholder:text-gray-400 dark:placeholder:text-[var(--theme-text-muted,#94a3b8)] ` +
                    `border border-gray-300 dark:border-[var(--theme-border,#475569)] ` +
                    `focus:border-[var(--theme-primary,#3b82f6)] ` +
                    `max-h-32 overflow-y-auto`
                  }
                  rows={3}
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <TextInput
                  label='Số tiền'
                  type='number'
                  inputMode='numeric'
                  className='no-spinner'
                  value={editAmount}
                  onChange={(e) =>
                    setEditAmount(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder='Ví dụ: 100000'
                  required
                />
                <Dropdown
                  id={`edit-category-select-${editTarget.id}`}
                  label='Danh mục'
                  options={categoryOptions}
                  className='dropdown-rounded'
                  value={editCategoryId as number | ''}
                  onChange={(e) => setEditCategoryId(Number(e.target.value))}
                  placeholder='Chọn danh mục'
                  required
                />
              </div>
            </div>
            <div className='flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-800'>
              <Button
                variant='secondary'
                onClick={closeEdit}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button
                variant='primary'
                onClick={onUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
};

export default TodayExpenses;
