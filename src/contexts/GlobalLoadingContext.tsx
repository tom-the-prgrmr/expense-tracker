import { useCallback, useMemo, useState, type FC, type ReactNode } from 'react';
import {
  GlobalLoadingContext,
  type GlobalLoadingContextValue,
} from './GlobalLoadingContextInstance';

export const GlobalLoadingProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  const value = useMemo<GlobalLoadingContextValue>(
    () => ({ isLoading, message, showLoading, hideLoading }),
    [isLoading, message, showLoading, hideLoading]
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export {};
