import { useGlobalLoading } from '@/contexts/GlobalLoadingContextInstance';
import { type FC } from 'react';

const GlobalLoading: FC = () => {
  const { isLoading, message } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-[2000] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      <div className='relative card px-6 py-5 flex items-center gap-3'>
        <span className='inline-block w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
        <span className='text-sm text-primary'>{message ?? 'Đang tải...'}</span>
      </div>
    </div>
  );
};

export default GlobalLoading;
