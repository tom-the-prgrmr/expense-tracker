import { useGlobalLoading } from '@/contexts/GlobalLoadingContextInstance';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useApiQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    loadingMessage?: string;
  }
) {
  const { showLoading, hideLoading } = useGlobalLoading();
  const { loadingMessage, ...queryOptions } = options;

  const query = useQuery(queryOptions);

  useEffect(() => {
    if (query.isLoading) {
      showLoading(loadingMessage);
    } else {
      hideLoading();
    }
  }, [query.isLoading, showLoading, hideLoading, loadingMessage]);

  return query;
}
