import { createBudget, deleteBudget, updateBudget } from '@/config/api';
import type { UpdateBudgetRequest } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for creating a budget
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      // Invalidate all budget queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-dashboard'] });
    },
  });
}

/**
 * Hook for updating a budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      data,
    }: {
      budgetId: number;
      data: UpdateBudgetRequest;
    }) => updateBudget(budgetId, data),
    onSuccess: () => {
      // Invalidate all budget queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-dashboard'] });
    },
  });
}

/**
 * Hook for deleting a budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      // Invalidate all budget queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-dashboard'] });
    },
  });
}

/**
 * Combined hook that provides all budget mutations
 */
export function useBudgetMutations() {
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
