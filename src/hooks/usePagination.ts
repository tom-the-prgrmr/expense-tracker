import { useMemo, useState } from 'react';

export interface PaginationOptions {
  totalItems: number;
  pageSize: number;
  initialPage?: number;
  maxVisiblePages?: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
}

export interface PaginationReturn extends PaginationState, PaginationActions {
  paginationItems: (number | string)[];
  getPageData: <T>(data: T[]) => T[];
}

/**
 * Custom hook for pagination logic
 * @param options - Pagination configuration
 * @returns Pagination state, actions, and utilities
 */
export const usePagination = (options: PaginationOptions) => {
  const {
    totalItems,
    pageSize: initialPageSize,
    initialPage = 1,
    maxVisiblePages = 5,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate pagination state
  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      startIndex,
      endIndex,
      hasNextPage,
      hasPreviousPage,
    };
  }, [currentPage, pageSize, totalItems]);

  // Generate pagination items with ellipsis
  const paginationItems = useMemo((): (number | string)[] => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const items: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      if (currentPage > 3) {
        items.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        items.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }

    return items;
  }, [currentPage, totalItems, pageSize, maxVisiblePages]);

  // Pagination actions
  const actions: PaginationActions = useMemo(
    () => ({
      goToPage: (page: number) => {
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
      },
      goToNextPage: () => {
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        if (currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      goToPreviousPage: () => {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      },
      goToFirstPage: () => {
        setCurrentPage(1);
      },
      goToLastPage: () => {
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        setCurrentPage(totalPages);
      },
      setPageSize: (size: number) => {
        setPageSize(Math.max(1, size));
        setCurrentPage(1); // Reset to first page when changing page size
      },
    }),
    [currentPage, totalItems, pageSize]
  );

  // Utility function to get paginated data
  const getPageData = <T>(data: T[]): T[] => {
    const { startIndex, endIndex } = paginationState;
    return data.slice(startIndex, endIndex + 1);
  };

  return {
    ...paginationState,
    ...actions,
    paginationItems,
    getPageData,
  };
};
