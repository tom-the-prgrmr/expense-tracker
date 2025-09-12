import { type FC } from 'react';

// Simple icon components for pagination
const ChevronLeftIcon: FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    ‹
  </span>
);

const ChevronRightIcon: FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    ›
  </span>
);

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationItems: (number | string)[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  showInfo?: boolean;
  totalItems?: number;
  pageSize?: number;
  startIndex?: number;
  endIndex?: number;
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  paginationItems,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  showInfo = false,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  className = '',
  prevLabel = 'Trước',
  nextLabel = 'Sau',
  disabled = false,
}) => {
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no pages
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Layout */}
      <div className='flex flex-col gap-3 sm:hidden'>
        {/* Page info on top for mobile */}
        {showInfo &&
          totalItems &&
          pageSize &&
          startIndex !== undefined &&
          endIndex !== undefined && (
            <div className='text-center text-sm text-muted px-2'>
              Hiển thị {startIndex + 1}-{Math.min(endIndex + 1, totalItems)}{' '}
              trong {totalItems} mục
            </div>
          )}

        {/* Navigation buttons and page numbers */}
        <div className='flex items-center justify-between'>
          <button
            className='w-8 h-8 rounded-md text-sm border transition-all duration-200 bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500 disabled:opacity-50 flex items-center justify-center'
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || disabled}
            title={prevLabel}
          >
            <ChevronLeftIcon className='text-lg' />
          </button>

          {/* Page numbers - centered */}
          <div className='flex items-center gap-1 max-w-[200px] overflow-x-auto px-2'>
            {paginationItems.map((item, index) => (
              <div key={index}>
                {typeof item === 'number' ? (
                  <button
                    className={`w-8 h-8 rounded-md text-sm border transition-all duration-200 ${
                      item === currentPage
                        ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white border-transparent shadow-md'
                        : 'bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && onPageChange(item)}
                    disabled={disabled}
                  >
                    {item}
                  </button>
                ) : (
                  <span className='w-8 h-8 flex items-center justify-center text-sm text-gray-400'>
                    {item}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            className='w-8 h-8 rounded-md text-sm border transition-all duration-200 bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500 disabled:opacity-50 flex items-center justify-center'
            onClick={onNextPage}
            disabled={!hasNextPage || disabled}
            title={nextLabel}
          >
            <ChevronRightIcon className='text-lg' />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden sm:flex sm:items-center sm:justify-between sm:gap-4'>
        {/* Previous button */}
        <button
          className='w-9 h-9 rounded-lg text-sm border transition-all duration-200 bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500 hover:scale-105 disabled:opacity-50 flex items-center justify-center'
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || disabled}
          title={prevLabel}
        >
          <ChevronLeftIcon className='text-xl' />
        </button>

        {/* Page info (optional) */}
        {showInfo &&
          totalItems &&
          pageSize &&
          startIndex !== undefined &&
          endIndex !== undefined && (
            <div className='text-sm text-muted px-4 py-2 bg-dark-800/30 rounded-lg border border-dark-600/50'>
              Hiển thị{' '}
              <span className='font-medium text-primary'>
                {startIndex + 1}-{Math.min(endIndex + 1, totalItems)}
              </span>{' '}
              trong{' '}
              <span className='font-medium text-primary'>{totalItems}</span> mục
            </div>
          )}

        {/* Page numbers */}
        <div className='flex items-center gap-1.5'>
          {paginationItems.map((item, index) => (
            <div key={index}>
              {typeof item === 'number' ? (
                <button
                  className={`w-9 h-9 rounded-lg text-sm border transition-all duration-200 ${
                    item === currentPage
                      ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white border-transparent shadow-lg transform scale-110'
                      : 'bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500 hover:scale-105'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && onPageChange(item)}
                  disabled={disabled}
                >
                  {item}
                </button>
              ) : (
                <span className='w-9 h-9 flex items-center justify-center text-sm text-gray-400'>
                  {item}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          className='w-9 h-9 rounded-lg text-sm border transition-all duration-200 bg-dark-700/50 text-gray-300 border-dark-600 hover:bg-dark-600/50 hover:border-dark-500 hover:scale-105 disabled:opacity-50 flex items-center justify-center'
          onClick={onNextPage}
          disabled={!hasNextPage || disabled}
          title={nextLabel}
        >
          <ChevronRightIcon className='text-xl' />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
