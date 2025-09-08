import { type FC, type ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  icon: string;
  subtitle: string;
  children: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, icon, subtitle, children }) => {
  return (
    <div className='w-full p-4 sm:p-6 lg:p-8 font-sans'>
      <header className='text-center mb-8 sm:mb-12'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3'>
          <span className='text-3xl sm:text-4xl'>{icon}</span>
          {title}
        </h1>
        <p className='text-sm sm:text-base lg:text-lg text-gray-600'>
          {subtitle}
        </p>
      </header>
      {children}
    </div>
  );
};

export default PageLayout;
