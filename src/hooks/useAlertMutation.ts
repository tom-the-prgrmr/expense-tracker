import { createAlert, updateAlert } from '@/config/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for creating an alert
 */
export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      // Invalidate all alert queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

/**
 * Hook for updating an alert
 */
export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      data,
    }: {
      alertId: number;
      data: Parameters<typeof updateAlert>[1];
    }) => updateAlert(alertId, data),
    onSuccess: () => {
      // Invalidate all alert queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

/**
 * Combined hook that provides all alert mutations
 */
export function useAlertMutations() {
  const createMutation = useCreateAlert();
  const updateMutation = useUpdateAlert();

  return {
    create: createMutation,
    update: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
