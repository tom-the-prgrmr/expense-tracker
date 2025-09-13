import { fetchMoneyNotes } from '@/config/api';
import type { MoneyNotesQuery, MoneyNotesResponse } from '@/types/api';
import { useApiQuery } from './useApiQuery';

/**
 * Hook for fetching money notes with date range (ISO date strings)
 */
export function useMoneyNoteQuery(
  query: MoneyNotesQuery,
  options?: {
    enabled?: boolean;
    loadingMessage?: string;
  }
) {
  return useApiQuery<MoneyNotesResponse>({
    queryKey: ['money-notes', query.start_date, query.end_date],
    queryFn: () => fetchMoneyNotes(query.start_date, query.end_date),
    enabled: options?.enabled ?? true,
    loadingMessage: options?.loadingMessage ?? 'Đang tải dữ liệu chi tiêu...',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching money notes with UTC epoch timestamps
 */
export function useMoneyNoteQueryByTimestamp(
  startTimestamp: number,
  endTimestamp: number,
  options?: {
    enabled?: boolean;
    loadingMessage?: string;
  }
) {
  return useMoneyNoteQuery(
    { start_date: startTimestamp, end_date: endTimestamp },
    options
  );
}
