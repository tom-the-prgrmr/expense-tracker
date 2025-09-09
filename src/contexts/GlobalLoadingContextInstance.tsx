import { createContext, useContext } from 'react';

export interface GlobalLoadingContextValue {
  isLoading: boolean;
  message?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const GlobalLoadingContext = createContext<
  GlobalLoadingContextValue | undefined
>(undefined);

export const useGlobalLoading = (): GlobalLoadingContextValue => {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx)
    throw new Error(
      'useGlobalLoading must be used within GlobalLoadingProvider'
    );
  return ctx;
};
