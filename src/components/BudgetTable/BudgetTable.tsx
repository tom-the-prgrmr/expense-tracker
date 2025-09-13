import { type AlertDto, type CategoryDto } from '@/types/api';
import { formatCurrencyVND } from '@/utils/date';
import { type FC, useCallback, useMemo, useState } from 'react';
import Button from '../Button/Button';
import ProgressBar from '../Charts/ProgressBar';
import TextInput from '../Form/TextInput/TextInput';

export interface BudgetTableProps {
  alerts: AlertDto[];
  categories: CategoryDto[];
  expenses: Record<number, number>; // category_id -> total expense
  onUpdate: (
    alertId: number,
    data: { title: string; amount: number; status: number }
  ) => Promise<void>;
  onDelete: (alertId: number) => Promise<void>;
  className?: string;
}

const BudgetTable: FC<BudgetTableProps> = ({
  alerts,
  categories,
  expenses,
  onUpdate,
  onDelete,
  className = '',
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ title: string; amount: number }>({
    title: '',
    amount: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<number, CategoryDto>);
  }, [categories]);

  const handleEdit = useCallback((alert: AlertDto) => {
    setEditingId(alert.id);
    setEditData({
      title: alert.title,
      amount: alert.threshold,
    });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({ title: '', amount: 0 });
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingId) return;

    setIsUpdating(true);
    try {
      await onUpdate(editingId, {
        title: editData.title,
        amount: editData.amount,
        status: 2, // active
      });
      setEditingId(null);
      setEditData({ title: '', amount: 0 });
    } catch (error) {
      console.error('Failed to update alert:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [editingId, editData, onUpdate]);

  const handleDelete = useCallback(
    async (alertId: number) => {
      if (!confirm('Bạn có chắc chắn muốn xóa hạn mức này?')) return;

      setIsUpdating(true);
      try {
        await onDelete(alertId);
      } catch (error) {
        console.error('Failed to delete alert:', error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onDelete]
  );

  const getCategoryColor = useCallback((categoryId: number) => {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#ec4899',
      '#6366f1',
    ];
    return colors[categoryId % colors.length];
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop Table View */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <th
                className='text-left py-3 px-4 text-sm font-medium'
                style={{ color: 'var(--theme-text)' }}
              >
                STT
              </th>
              <th
                className='text-left py-3 px-4 text-sm font-medium'
                style={{ color: 'var(--theme-text)' }}
              >
                Danh mục
              </th>
              <th
                className='text-left py-3 px-4 text-sm font-medium'
                style={{ color: 'var(--theme-text)' }}
              >
                Hạn mức
              </th>
              <th
                className='text-center py-3 px-4 text-sm font-medium'
                style={{ color: 'var(--theme-text)' }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => {
              const category = categoryMap[alert.category_id];
              const expense = expenses[alert.category_id] || 0;
              const isEditing = editingId === alert.id;

              return (
                <tr
                  key={alert.id}
                  style={{ borderBottom: '1px solid var(--theme-border)' }}
                >
                  <td
                    className='py-3 px-4 text-sm'
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {index + 1}
                  </td>

                  <td className='py-3 px-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{
                            backgroundColor: getCategoryColor(
                              alert.category_id
                            ),
                          }}
                        />
                        <span
                          className='text-sm font-medium'
                          style={{ color: 'var(--theme-text)' }}
                        >
                          {category?.name || 'Không xác định'}
                        </span>
                      </div>
                      <ProgressBar
                        current={expense}
                        total={alert.threshold}
                        size='sm'
                        showValues={false}
                        showPercentage={true}
                        color={expense > alert.threshold ? 'danger' : 'primary'}
                      />
                    </div>
                  </td>

                  <td className='py-3 px-4'>
                    {isEditing ? (
                      <TextInput
                        type='number'
                        value={editData.amount}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            amount: Number(e.target.value),
                          }))
                        }
                        className='w-32'
                        min='0'
                        step='1000'
                      />
                    ) : (
                      <span
                        className='text-sm font-medium'
                        style={{ color: 'var(--theme-text)' }}
                      >
                        {formatCurrencyVND(alert.threshold)}
                      </span>
                    )}
                  </td>

                  <td className='py-3 px-4'>
                    <div className='flex items-center justify-center gap-2'>
                      {isEditing ? (
                        <>
                          <Button
                            size='sm'
                            variant='primary'
                            onClick={handleSave}
                            disabled={isUpdating}
                          >
                            Lưu
                          </Button>
                          <Button
                            size='sm'
                            variant='secondary'
                            onClick={handleCancel}
                            disabled={isUpdating}
                          >
                            Hủy
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size='sm'
                            variant='secondary'
                            onClick={() => handleEdit(alert)}
                            disabled={isUpdating}
                          >
                            Sửa
                          </Button>
                          <Button
                            size='sm'
                            variant='danger'
                            onClick={() => handleDelete(alert.id)}
                            disabled={isUpdating}
                          >
                            Xóa
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='lg:hidden space-y-4'>
        {alerts.map((alert, index) => {
          const category = categoryMap[alert.category_id];
          const expense = expenses[alert.category_id] || 0;
          const isEditing = editingId === alert.id;

          return (
            <div
              key={alert.id}
              className='p-4 rounded-xl border transition-all duration-200'
              style={{
                backgroundColor: 'var(--theme-surface)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <div className='space-y-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='text-sm font-medium'
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      #{index + 1}
                    </span>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{
                        backgroundColor: getCategoryColor(alert.category_id),
                      }}
                    />
                    <span
                      className='text-sm font-medium'
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {category?.name || 'Không xác định'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  current={expense}
                  total={alert.threshold}
                  size='sm'
                  showValues={false}
                  showPercentage={true}
                  color={expense > alert.threshold ? 'danger' : 'primary'}
                />

                {/* Budget Amount */}
                <div>
                  <label
                    className='block text-xs font-medium mb-1'
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    Hạn mức
                  </label>
                  {isEditing ? (
                    <TextInput
                      type='number'
                      value={editData.amount}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          amount: Number(e.target.value),
                        }))
                      }
                      min='0'
                      step='1000'
                    />
                  ) : (
                    <span
                      className='text-sm font-medium'
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {formatCurrencyVND(alert.threshold)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div
                  className='flex items-center justify-end gap-2 pt-2 border-t'
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  {isEditing ? (
                    <>
                      <Button
                        size='sm'
                        variant='primary'
                        onClick={handleSave}
                        disabled={isUpdating}
                      >
                        Lưu
                      </Button>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => handleEdit(alert)}
                        disabled={isUpdating}
                      >
                        Sửa
                      </Button>
                      <Button
                        size='sm'
                        variant='danger'
                        onClick={() => handleDelete(alert.id)}
                        disabled={isUpdating}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className='text-center py-8'>
          <p
            className='text-sm'
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            Chưa có hạn mức nào được thiết lập
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetTable;
