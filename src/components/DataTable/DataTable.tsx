import { type ReactNode, memo } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  rowKey: (row: T, index: number) => string | number;
  className?: string;
  maxHeight?: number;
  enableScroll?: boolean;
  responsiveHeight?: boolean;
}

const cellAlignClass = (align?: 'left' | 'right' | 'center') => {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
};

const DataTableInner = <T,>({
  columns,
  data,
  isLoading,
  emptyState,
  rowKey,
  className,
  maxHeight = 240, // 15rem equivalent
  enableScroll = true,
  responsiveHeight = true,
}: DataTableProps<T>) => {
  const getCellValue = (row: T, key: keyof T | string): ReactNode => {
    if (typeof key === 'string') {
      const record = row as unknown as Record<string, unknown>;
      return (record[key] as ReactNode) ?? '';
    }
    const value = row[key] as unknown as ReactNode;
    return value ?? '';
  };
  const shouldScroll = enableScroll && data.length > 10;

  return (
    <div className={className}>
      <div
        className={`overflow-x-auto rounded-lg border ${
          shouldScroll
            ? `overflow-y-auto ${
                responsiveHeight
                  ? 'max-h-80 sm:max-h-60 md:max-h-80 lg:max-h-96'
                  : ''
              }`
            : ''
        }`}
        style={{
          borderColor: 'var(--theme-border)',
          background: 'var(--theme-surface)',
          ...(shouldScroll &&
            !responsiveHeight && { maxHeight: `${maxHeight}px` }),
        }}
      >
        <table
          className='min-w-full'
          style={{ background: 'var(--theme-surface)' }}
        >
          <thead
            style={{
              background: 'var(--theme-surface-secondary)',
              borderBottom: '1px solid var(--theme-border)',
            }}
          >
            <tr>
              {columns.map((col, i) => (
                <th
                  key={String(col.key) + i}
                  className={`px-6 py-1.5 text-xs font-medium uppercase tracking-wider ${cellAlignClass(
                    col.align
                  )}`}
                  style={{ color: 'var(--theme-text-muted)', width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-3 text-sm'
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='px-6 py-4'>
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  className='transition-colors'
                  style={{ borderTop: '1px solid var(--theme-border)' }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = 'var(--theme-surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col, ci) => (
                    <td
                      key={String(col.key) + ci}
                      className={`px-6 py-2 text-sm ${cellAlignClass(
                        col.align
                      )}`}
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {col.render
                        ? col.render(row)
                        : getCellValue(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DataTable = memo(DataTableInner) as typeof DataTableInner;
export default DataTable;
