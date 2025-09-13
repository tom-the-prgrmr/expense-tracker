// Date/time and formatting utilities

export const formatDateLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseEpochSecondsOrIsoToDate = (value: unknown): Date => {
  if (typeof value === 'number') return new Date(value * 1000);
  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && value.trim() !== '')
      return new Date(numeric * 1000);
    return new Date(value);
  }
  return new Date();
};

export const formatCurrencyVND = (amount: number): string => {
  return `${Number(amount || 0).toLocaleString('vi-VN')}₫`;
};

export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Re-export UTC time utilities for backward compatibility
export {
  localDateToUtcEndOfDayEpochSeconds as localDateToEndOfDayEpochSeconds,
  localDateToUtcEpochSeconds as localDateToEpochSeconds,
} from './time';
