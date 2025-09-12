import Dropdown, {
  type DropdownOption,
} from '@/components/Form/Dropdown/Dropdown';
import { type FC } from 'react';

export interface PageSizeDropdownProps {
  currentPageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  options?: number[];
  className?: string;
  disabled?: boolean;
}

const PageSizeDropdown: FC<PageSizeDropdownProps> = ({
  currentPageSize,
  onPageSizeChange,
  options = [10, 20, 50, 100],
  className = '',
  disabled = false,
}) => {
  const dropdownOptions: DropdownOption[] = options.map((size) => ({
    value: size,
    label: size.toString(),
  }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageSizeChange(newPageSize);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className='text-sm text-muted whitespace-nowrap hidden sm:inline'>
        Hiển thị:
      </span>
      <span className='text-sm text-muted whitespace-nowrap sm:hidden'>
        Số mục:
      </span>
      <Dropdown
        options={dropdownOptions}
        value={currentPageSize}
        onChange={handleChange}
        disabled={disabled}
        className='w-auto min-w-[60px]'
        placeholder='Chọn số mục'
      />
    </div>
  );
};

export default PageSizeDropdown;
