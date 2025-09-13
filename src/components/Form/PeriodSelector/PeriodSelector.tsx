import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { formatDateLocalYYYYMMDD, getFirstDayOfMonth } from '@/utils/date';
import { type FC, useCallback, useMemo, useState } from 'react';
import Dropdown, { type DropdownOption } from '../Dropdown/Dropdown';

export type PeriodType = 'day' | 'month' | 'year';

export interface PeriodSelectorProps {
  value: {
    type: PeriodType;
    date: string; // YYYY-MM-DD
  };
  onChange: (value: { type: PeriodType; date: string }) => void;
  className?: string;
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

const PeriodSelector: FC<PeriodSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [selectedType, setSelectedType] = useState<PeriodType>(value.type);
  const [selectedDate, setSelectedDate] = useState<string>(value.date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<number>(() =>
    new Date(selectedDate).getMonth()
  );
  const [viewYear, setViewYear] = useState<number>(() =>
    new Date(selectedDate).getFullYear()
  );

  const calendarRef = useOnClickOutside<HTMLDivElement>(() =>
    setIsCalendarOpen(false)
  );

  const periodOptions: DropdownOption[] = [
    { value: 'day', label: 'Theo ngày' },
    { value: 'month', label: 'Theo tháng' },
    { value: 'year', label: 'Theo năm' },
  ];

  const handleTypeChange = useCallback(
    (type: string) => {
      const newType = type as PeriodType;
      setSelectedType(newType);

      // Adjust date based on period type
      const currentDate = new Date(selectedDate);
      let newDate: string;

      switch (newType) {
        case 'day':
          newDate = formatDateLocalYYYYMMDD(currentDate);
          break;
        case 'month':
          newDate = formatDateLocalYYYYMMDD(getFirstDayOfMonth(currentDate));
          break;
        case 'year':
          newDate = formatDateLocalYYYYMMDD(
            new Date(currentDate.getFullYear(), 0, 1)
          );
          break;
        default:
          newDate = selectedDate;
      }

      setSelectedDate(newDate);
      onChange({ type: newType, date: newDate });
    },
    [selectedDate, onChange]
  );

  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      onChange({ type: selectedType, date });
      setIsCalendarOpen(false);
    },
    [selectedType, onChange]
  );

  const toggleCalendar = useCallback(() => {
    const current = new Date(selectedDate);
    if (!Number.isNaN(current.getTime())) {
      setViewMonth(current.getMonth());
      setViewYear(current.getFullYear());
    }
    setIsCalendarOpen((prev) => !prev);
  }, [selectedDate]);

  // Calendar generation logic
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
    const rows: Array<typeof cells> = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [startWeekday, daysInMonth, viewYear, viewMonth]);

  const selectDate = useCallback(
    (iso?: string) => {
      if (!iso) return;
      handleDateChange(iso);
    },
    [handleDateChange]
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

  const getDateDisplayValue = useCallback(() => {
    const currentDate = new Date(selectedDate);

    switch (selectedType) {
      case 'day':
        return selectedDate;
      case 'month':
        return formatDateLocalYYYYMMDD(getFirstDayOfMonth(currentDate));
      case 'year':
        return formatDateLocalYYYYMMDD(
          new Date(currentDate.getFullYear(), 0, 1)
        );
      default:
        return selectedDate;
    }
  }, [selectedDate, selectedType]);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className || ''}`}>
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Period Type Dropdown */}
        <div className='flex-1'>
          <label
            className='block text-sm font-medium mb-2'
            style={{ color: 'var(--theme-text)' }}
          >
            Chọn khoảng thời gian
          </label>
          <Dropdown
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={periodOptions}
            placeholder='Chọn loại thời gian'
          />
        </div>

        {/* Date Display with Calendar */}
        <div className='flex-1 relative'>
          <label
            className='block text-sm font-medium mb-2'
            style={{ color: 'var(--theme-text)' }}
          >
            {selectedType === 'day' && 'Chọn ngày'}
            {selectedType === 'month' && 'Chọn tháng'}
            {selectedType === 'year' && 'Chọn năm'}
          </label>
          <div className='relative'>
            <button
              type='button'
              onClick={toggleCalendar}
              className='w-full px-4 py-2.5 rounded-xl border transition-all duration-200 text-left flex items-center justify-between'
              style={{
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-text)',
                borderColor: 'var(--theme-border)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <span>{getDateDisplayValue()}</span>
              <CalendarIcon className='w-5 h-5' />
            </button>

            {isCalendarOpen && (
              <div
                ref={calendarRef}
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
                    className='px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors'
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
                    className='px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors'
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
                          const isSelected = cell.date === selectedDate;
                          const isToday =
                            cell.date === new Date().toISOString().slice(0, 10);
                          return (
                            <button
                              key={`${i}-${j}`}
                              disabled={!cell.day}
                              onClick={() => selectDate(cell.date)}
                              className='h-9 rounded-lg flex items-center justify-center select-none transition-all hover:bg-gray-100'
                              style={{
                                backgroundColor: isSelected
                                  ? 'var(--theme-primary)'
                                  : 'transparent',
                                color: isSelected
                                  ? '#fff'
                                  : 'var(--theme-text)',
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
                      onClick={() => setIsCalendarOpen(false)}
                      className='text-xs px-3 py-1.5 rounded-lg'
                      style={{
                        color: '#fff',
                        background: 'var(--theme-primary)',
                      }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodSelector;
