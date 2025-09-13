import { type CategoryDto } from '@/types/api';
import { type FC, useCallback, useState } from 'react';
import Button from '../Button/Button';
import Dropdown, { type DropdownOption } from '../Form/Dropdown/Dropdown';
import Slider from '../Form/Slider/Slider';
import TextInput from '../Form/TextInput/TextInput';

export interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryDto[];
  onCreate: (data: {
    categoryId: number;
    title: string;
    amount: number;
  }) => Promise<void>;
}

const CreateBudgetModal: FC<CreateBudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  onCreate,
}) => {
  const [categoryId, setCategoryId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(1000000);
  const [isCreating, setIsCreating] = useState(false);

  const categoryOptions: DropdownOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleCreate = useCallback(async () => {
    if (!categoryId || !title.trim()) return;

    setIsCreating(true);
    try {
      await onCreate({
        categoryId,
        title: title.trim(),
        amount,
      });
      // Reset form
      setCategoryId(0);
      setTitle('');
      setAmount(1000000);
      onClose();
    } catch (error) {
      console.error('Failed to create budget:', error);
    } finally {
      setIsCreating(false);
    }
  }, [categoryId, title, amount, onCreate, onClose]);

  const handleClose = useCallback(() => {
    if (isCreating) return;
    onClose();
  }, [isCreating, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300'
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto'
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        {/* Header */}
        <div
          className='flex items-center justify-between p-4 sm:p-6 border-b sticky top-0'
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
          }}
        >
          <div>
            <h2
              className='text-base sm:text-lg font-semibold'
              style={{ color: 'var(--theme-text)' }}
            >
              Tạo hạn mức mới
            </h2>
            <p
              className='text-xs sm:text-sm'
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Đặt hạn mức chi tiêu cho danh mục
            </p>
          </div>
          <button
            onClick={handleClose}
            className='p-2 rounded-lg transition-colors'
            style={{
              backgroundColor: 'var(--theme-surface-secondary)',
              color: 'var(--theme-text-secondary)',
            }}
            disabled={isCreating}
          >
            <span className='text-lg'>✕</span>
          </button>
        </div>

        {/* Content */}
        <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
          <Dropdown
            label='Danh mục'
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            options={categoryOptions}
            placeholder='Chọn danh mục'
            required
          />

          <TextInput
            label='Tên hạn mức'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Nhập tên hạn mức'
            required
          />

          <Slider
            label='Hạn mức'
            value={amount}
            onChange={setAmount}
            min={100000}
            max={50000000}
            step={100000}
            helperText='Kéo thanh trượt để điều chỉnh hạn mức'
          />
        </div>

        {/* Footer */}
        <div
          className='flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t sticky bottom-0'
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
          }}
        >
          <Button
            variant='secondary'
            onClick={handleClose}
            disabled={isCreating}
            fullWidth
            className='sm:w-auto'
          >
            Hủy
          </Button>
          <Button
            variant='primary'
            onClick={handleCreate}
            disabled={!categoryId || !title.trim() || isCreating}
            fullWidth
            className='sm:w-auto'
          >
            {isCreating ? 'Đang tạo...' : 'Tạo hạn mức'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetModal;
