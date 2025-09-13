import { formatCurrencyVND } from '@/utils/date';
import { type FC, useCallback, useMemo } from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  className?: string;
  showCurrency?: boolean;
}

const Slider: FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 10000000,
  step = 100000,
  label,
  helperText,
  className = '',
  showCurrency = true,
}) => {
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onChange(newValue);
    },
    [onChange]
  );

  const formatValue = useCallback(
    (val: number) => {
      if (showCurrency) {
        return formatCurrencyVND(val);
      }
      return val.toLocaleString('vi-VN');
    },
    [showCurrency]
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          className='block text-sm font-medium'
          style={{ color: 'var(--theme-text)' }}
        >
          {label}
        </label>
      )}

      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <span
            className='text-sm'
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {formatValue(min)}
          </span>
          <span
            className='text-lg font-semibold'
            style={{ color: 'var(--theme-primary)' }}
          >
            {formatValue(value)}
          </span>
          <span
            className='text-sm'
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {formatValue(max)}
          </span>
        </div>

        <div className='relative'>
          <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
            style={{
              background: `linear-gradient(to right, var(--theme-primary) 0%, var(--theme-primary) ${percentage}%, var(--theme-border) ${percentage}%, var(--theme-border) 100%)`,
            }}
          />
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: var(--theme-primary);
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }

            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: var(--theme-primary);
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </div>
      </div>

      {helperText && (
        <p className='text-xs' style={{ color: 'var(--theme-text-secondary)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Slider;
