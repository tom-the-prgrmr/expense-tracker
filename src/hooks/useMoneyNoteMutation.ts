import {
  createMoneyNotes,
  deleteMoneyNote,
  updateMoneyNote,
} from '@/config/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for creating money notes
 */
export function useCreateMoneyNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMoneyNotes,
    onSuccess: () => {
      // Invalidate all money-note queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['money-notes'] });
    },
  });
}

/**
 * Hook for updating a single money note
 */
export function useUpdateMoneyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      data,
    }: {
      noteId: number;
      data: Parameters<typeof updateMoneyNote>[1];
    }) => updateMoneyNote(noteId, data),
    onSuccess: () => {
      // Invalidate all money-note queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['money-notes'] });
    },
  });
}

/**
 * Hook for deleting a money note
 */
export function useDeleteMoneyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMoneyNote,
    onSuccess: () => {
      // Invalidate all money-note queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['money-notes'] });
    },
  });
}

/**
 * Combined hook that provides all money note mutations
 */
export function useMoneyNoteMutations() {
  const createMutation = useCreateMoneyNotes();
  const updateMutation = useUpdateMoneyNote();
  const deleteMutation = useDeleteMoneyNote();

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
