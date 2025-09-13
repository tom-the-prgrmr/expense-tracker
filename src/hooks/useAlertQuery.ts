import { fetchAlerts } from '@/config/api';
import type { AlertsResponse } from '@/types/api';
import { utcIsoDateToEpochSeconds } from '@/utils/time';
import { useApiQuery } from './useApiQuery';

/**
 * Hook for fetching alerts with date range (UTC epoch timestamps)
 */
export function useAlertQuery(
  startDate: number,
  endDate: number,
  options?: {
    enabled?: boolean;
    loadingMessage?: string;
  }
) {
  return useApiQuery<AlertsResponse>({
    queryKey: ['alerts', startDate, endDate],
    queryFn: () => fetchAlerts(startDate, endDate),
    enabled: options?.enabled ?? true,
    loadingMessage: options?.loadingMessage ?? 'Đang tải hạn mức...',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching alerts with date range (ISO date strings converted to UTC)
 */
export function useAlertQueryByDate(
  startDate: string,
  endDate: string,
  options?: {
    enabled?: boolean;
    loadingMessage?: string;
  }
) {
  // Convert ISO date strings to UTC epoch timestamps
  const startTimestamp = utcIsoDateToEpochSeconds(startDate);
  const endTimestamp = utcIsoDateToEpochSeconds(endDate);

  return useAlertQuery(startTimestamp, endTimestamp, options);
}
