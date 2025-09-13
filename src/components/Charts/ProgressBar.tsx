import { formatCurrencyVND } from '@/utils/date';
import { type FC, useMemo } from 'react';

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showValues?: boolean;
  showPercentage?: boolean;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showValues = true,
  showPercentage = true,
  className = '',
  color = 'primary',
  size = 'md',
}) => {
  const percentage = useMemo(() => {
    if (total === 0) return 0;
    return Math.min((current / total) * 100, 100);
  }, [current, total]);

  const isOverBudget = useMemo(() => {
    return current > total;
  }, [current, total]);

  const colorClasses = useMemo(() => {
    const colors = {
      primary: 'var(--theme-primary)',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    };

    if (isOverBudget) return colors.danger;
    return colors[color];
  }, [color, isOverBudget]);

  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };
    return sizes[size];
  }, [size]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1'>
          <span
            className='text-sm font-medium'
            style={{ color: 'var(--theme-text)' }}
          >
            {label}
          </span>
          {showPercentage && (
            <span
              className='text-sm font-semibold'
              style={{
                color: isOverBudget ? '#ef4444' : 'var(--theme-text-secondary)',
              }}
            >
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}

      <div
        className='w-full rounded-full overflow-hidden transition-all duration-200'
        style={{ backgroundColor: 'var(--theme-border)' }}
      >
        <div
          className={`${sizeClasses} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${percentage}%`,
            backgroundColor: colorClasses,
          }}
        />
      </div>

      {showValues && (
        <div
          className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs'
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <span>Đã chi: {formatCurrencyVND(current)}</span>
          <span>Hạn mức: {formatCurrencyVND(total)}</span>
        </div>
      )}

      {isOverBudget && (
        <div
          className='text-xs font-medium p-2 rounded-lg'
          style={{
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          ⚠️ Vượt hạn mức {formatCurrencyVND(current - total)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
