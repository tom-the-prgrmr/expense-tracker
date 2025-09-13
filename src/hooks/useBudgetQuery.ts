import { fetchBudgets } from '@/config/api';
import type { BudgetsResponse } from '@/types/api';
import { useApiQuery } from './useApiQuery';

/**
 * Hook for fetching budgets
 */
export function useBudgetQuery(options?: {
  enabled?: boolean;
  loadingMessage?: string;
}) {
  return useApiQuery<BudgetsResponse>({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    enabled: options?.enabled ?? true,
    loadingMessage: options?.loadingMessage ?? 'Đang tải ngân sách...',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook for fetching budgets for dashboard (with specific caching)
 */
export function useBudgetQueryForDashboard() {
  return useApiQuery<BudgetsResponse>({
    queryKey: ['budgets-dashboard'],
    queryFn: fetchBudgets,
    loadingMessage: undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
