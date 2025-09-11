import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface DatePickerProps {
  id?: string;
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  className?: string;
  hint?: string;
}

const CalendarIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
  >
    <path d='M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 1 1 2 0v1Zm13 6H4v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8Z' />
  </svg>
);

const DatePicker: FC<DatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  className,
  hint,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<number>(() =>
    new Date(value).getMonth()
  );
  const [viewYear, setViewYear] = useState<number>(() =>
    new Date(value).getFullYear()
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popRef = useOnClickOutside<HTMLDivElement>(
    () => setIsOpen(false),
    [inputRef]
  );

  const baseStyles = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: 'var(--theme-surface)',
      color: 'var(--theme-text)',
      borderColor: isFocused ? 'var(--theme-primary)' : 'var(--theme-border)',
      boxShadow: isFocused
        ? '0 0 0 3px rgba(0,0,0,0.06)'
        : '0 2px 10px rgba(0,0,0,0.04)',
    }),
    [isFocused]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const toggleOpen = useCallback(() => {
    const current = new Date(value);
    if (!Number.isNaN(current.getTime())) {
      setViewMonth(current.getMonth());
      setViewYear(current.getFullYear());
    }
    setIsOpen((s) => !s);
  }, [value]);
  const close = useCallback(() => setIsOpen(false), []);

  const firstDayOfMonth = useMemo(
    () => new Date(viewYear, viewMonth, 1),
    [viewYear, viewMonth]
  );
  const startWeekday = firstDayOfMonth.getDay(); // 0=Sun..6=Sat
  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth]
  );
  const weeks = useMemo(() => {
    const cells: Array<{ day: number | null; date?: string }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, date: iso });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null });
    const rows: (typeof cells)[] = [] as any;
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [startWeekday, daysInMonth, viewYear, viewMonth]);

  const selectDate = useCallback(
    (iso?: string) => {
      if (!iso) return;
      onChange(iso);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onChange]
  );

  const goPrevMonth = useCallback(() => {
    const dt = new Date(viewYear, viewMonth - 1, 1);
    setViewMonth(dt.getMonth());
    setViewYear(dt.getFullYear());
  }, [viewYear, viewMonth]);
  const goNextMonth = useCallback(() => {
    const dt = new Date(viewYear, viewMonth + 1, 1);
    setViewMonth(dt.getMonth());
    setViewYear(dt.getFullYear());
  }, [viewYear, viewMonth]);

  useEffect(() => {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  }, [value]);

  const handleInputChange = useCallback(
    (next: string) => {
      onChange(next);
      const d = new Date(next);
      if (!Number.isNaN(d.getTime())) {
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
      }
    },
    [onChange]
  );

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className='block text-xs font-medium mb-1'
          style={{ color: 'var(--theme-text-muted)' }}
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <div
          className='absolute inset-y-0 left-3 flex items-center text-sm'
          style={{
            color: isFocused
              ? 'var(--theme-primary)'
              : 'var(--theme-text-secondary)',
          }}
        >
          <CalendarIcon className='w-5 h-5' />
        </div>
        <input
          ref={inputRef}
          id={id}
          type='date'
          value={value}
          min={min}
          max={max}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='custom-date w-full px-10 py-2.5 rounded-xl border transition-all duration-200 outline-none'
          style={baseStyles}
          onClick={toggleOpen}
        />
      </div>
      {isOpen ? (
        <div
          ref={popRef}
          className='absolute z-50 mt-2 w-[280px] rounded-2xl border shadow-2xl overflow-hidden'
          style={{
            background: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div
            className='flex items-center justify-between px-4 py-3'
            style={{ borderBottom: '1px solid var(--theme-border)' }}
          >
            <button
              onClick={goPrevMonth}
              className='px-2 py-1 rounded-lg'
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              ‹
            </button>
            <div
              className='text-sm font-semibold'
              style={{ color: 'var(--theme-text)' }}
            >
              {new Date(viewYear, viewMonth).toLocaleString('vi-VN', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              onClick={goNextMonth}
              className='px-2 py-1 rounded-lg'
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              ›
            </button>
          </div>
          <div className='px-3 py-3'>
            <div
              className='grid grid-cols-7 gap-1 text-[11px]'
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                <div key={d} className='text-center py-1'>
                  {d}
                </div>
              ))}
            </div>
            <div className='mt-1 grid grid-cols-7 gap-1 text-sm'>
              {weeks.map((row, i) => (
                <div key={i} className='contents'>
                  {row.map((cell, j) => {
                    const isSelected = cell.date === value;
                    const isToday =
                      cell.date === new Date().toISOString().slice(0, 10);
                    return (
                      <button
                        key={`${i}-${j}`}
                        disabled={!cell.day}
                        onClick={() => selectDate(cell.date)}
                        className='h-9 rounded-lg flex items-center justify-center select-none transition-all'
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--theme-primary)'
                            : 'transparent',
                          color: isSelected ? '#fff' : 'var(--theme-text)',
                          border: isToday
                            ? '1px solid var(--theme-primary)'
                            : '1px solid transparent',
                          opacity: cell.day ? 1 : 0,
                        }}
                      >
                        {cell.day ?? ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className='mt-3 flex justify-end'>
              <button
                onClick={close}
                className='text-xs px-3 py-1.5 rounded-lg'
                style={{ color: '#fff', background: 'var(--theme-primary)' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {hint ? (
        <p
          className='mt-1 text-[11px]'
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default DatePicker;
