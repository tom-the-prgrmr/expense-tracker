import Button from '@/components/Button/Button';
import DataTable, { type Column } from '@/components/DataTable/DataTable';
import PageLayout from '@/components/PageLayout/PageLayout';
// Removed status switch per new requirements
import { useToast } from '@/components/Toast/useToast';
import { apiFetch } from '@/config/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { type CategoriesResponse, type CategoryDto } from '@/types/api';
import { parseEpochSecondsOrIsoToDate } from '@/utils/date';
import { type FC, useCallback, useMemo, useState } from 'react';

const ExpenseCategories: FC = () => {
  const { data, isLoading, refetch, isError, error } = useApiQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      apiFetch<CategoriesResponse>('/api/v1/category?status=2'),
    loadingMessage: 'Đang tải danh mục...',
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const items: CategoryDto[] = useMemo(() => data?.data ?? [], [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const toast = useToast();

  const openModal = useCallback(() => {
    setNameInput('');
    setFormError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onAdd = useCallback(async () => {
    const value = nameInput.trim();
    if (!value) {
      setFormError('Tên danh mục không được để trống.');
      return;
    }
    if (value.length > 20) {
      setFormError('Tên danh mục không vượt quá 20 ký tự.');
      return;
    }
    setFormError(null);
    try {
      await apiFetch<CategoriesResponse>('/api/v1/category', {
        method: 'POST',
        body: JSON.stringify({ type: 1, name: value }),
      });
      closeModal();
      await refetch();
      toast.showSuccess('Thêm danh mục thành công');
    } catch (err) {
      let message = 'Không thể thêm danh mục.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.message) message = parsed.message;
        } catch {
          if (err.message) message = err.message;
        }
      }
      setFormError(message);
      toast.showError(message);
    }
  }, [nameInput, closeModal, refetch, toast]);

  const onDelete = useCallback(
    async (category: CategoryDto) => {
      try {
        await apiFetch<CategoriesResponse>(`/api/v1/category/${category.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            type: category.type,
            name: category.name,
            status: 1, // mark as deactivated
          }),
        });
        toast.showSuccess('Xóa danh mục thành công');
        await refetch();
      } catch (err) {
        let message = 'Xóa danh mục thất bại';
        if (err instanceof Error && err.message) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.message) message = parsed.message;
          } catch {
            /* ignore parse error */
          }
        }
        toast.showError(message);
      }
    },
    [refetch, toast]
  );

  const columns = useMemo(() => {
    return [
      { key: 'id', header: 'ID', align: 'left' },
      { key: 'name', header: 'Tên danh mục', align: 'left' },
      {
        key: 'type',
        header: 'Loại',
        align: 'left',
        render: (row) =>
          (row as CategoryDto).type === 1 ? 'Chi tiêu' : 'Thu nhập',
      },
      {
        key: 'created_at',
        header: 'Tạo lúc',
        align: 'left',
        render: (row) => {
          const r = row as CategoryDto;
          const d = parseEpochSecondsOrIsoToDate(r.created_at);
          return (
            <span>
              {d.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          );
        },
      },
      {
        key: 'updated_at',
        header: 'Cập nhật',
        align: 'left',
        render: (row) => {
          const r = row as CategoryDto;
          const d = parseEpochSecondsOrIsoToDate(r.updated_at);
          return (
            <span>
              {d.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          );
        },
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (row) => {
          const r = row as CategoryDto;
          return (
            <Button size='sm' variant='danger' onClick={() => onDelete(r)}>
              Xóa
            </Button>
          );
        },
      },
    ] as Column<CategoryDto>[];
  }, [onDelete]);

  return (
    <PageLayout
      title='Phân loại chi tiêu'
      icon='🗂️'
      subtitle='Quản lý nhóm chi tiêu của bạn'
    >
      <div className='mb-4 px-1 sm:px-0'>
        <div className='flex items-center'>
          <div className='ml-auto'>
            <Button
              onClick={openModal}
              variant='primary'
              size='md'
              leadingIcon={'➕'}
            >
              Thêm danh mục
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800'>
        <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
            Danh sách danh mục
          </h3>
        </div>
        {isError ? (
          <div className='p-6 text-red-600 dark:text-red-400'>
            {(error as Error)?.message ?? 'Đã xảy ra lỗi.'}
          </div>
        ) : (
          <div className='p-2'>
            <DataTable
              columns={columns}
              data={items}
              enablePagination={true}
              pageSize={15}
              showPaginationInfo={true}
              showPageSizeDropdown={true}
              pageSizeOptions={[10, 20, 50, 100]}
              isLoading={isLoading}
              rowKey={(row) => (row as CategoryDto).id}
              emptyState={
                <div className='flex flex-col items-center justify-center gap-2 text-center'>
                  <div className='text-3xl'>🗂️</div>
                  <div
                    className='text-sm font-medium'
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Chưa có danh mục nào
                  </div>
                  <div
                    className='text-xs'
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    Hãy tạo danh mục mới để bắt đầu.
                  </div>
                </div>
              }
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-[2000] flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/40 modal-backdrop'
            onClick={closeModal}
          />
          <div className='relative w-[90%] max-w-md card-glass border p-4 sm:p-6'>
            <button
              className='absolute top-2 right-2 px-2 py-1 rounded-md'
              style={{
                backgroundColor: 'transparent',
                color: 'var(--theme-text)',
              }}
              onClick={closeModal}
              aria-label='Đóng'
            >
              ✕
            </button>
            <h4 className='text-lg font-semibold mb-4'>Thêm danh mục</h4>

            <label htmlFor='category-name' className='text-sm mb-1 block'>
              Tên danh mục
            </label>
            <input
              id='category-name'
              type='text'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className='w-full px-3 py-2 rounded-lg border'
              placeholder='Nhập tên danh mục (tối đa 20 ký tự)'
              maxLength={50}
            />
            <div
              className='text-xs mt-1'
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Tối đa 20 ký tự
            </div>
            {formError && (
              <div className='mt-2 text-sm text-red-600 dark:text-red-400'>
                {formError}
              </div>
            )}

            <div className='mt-6 flex items-center justify-end gap-2'>
              <Button onClick={closeModal} variant='secondary' size='sm'>
                Hủy
              </Button>
              <Button onClick={onAdd} variant='primary' size='sm'>
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ExpenseCategories;
