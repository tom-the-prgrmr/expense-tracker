import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook that provides query invalidation utilities
 * @returns Object with invalidation methods
 */
export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateMoneyNotes = () => {
    // Invalidate all money-note related queries
    queryClient.invalidateQueries({
      queryKey: ['money-notes'],
    });
    queryClient.invalidateQueries({
      queryKey: ['monthly-money-notes'],
    });
    queryClient.invalidateQueries({
      queryKey: ['today-money-notes'],
    });
  };

  const invalidateCategories = () => {
    // Invalidate category queries
    queryClient.invalidateQueries({
      queryKey: ['categories'],
    });
    queryClient.invalidateQueries({
      queryKey: ['categories-active'],
    });
  };

  const invalidateAll = () => {
    // Invalidate all queries
    queryClient.invalidateQueries();
  };

  return {
    invalidateMoneyNotes,
    invalidateCategories,
    invalidateAll,
  };
};
