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
        {/* Desktop-only sticky banner within PageLayout width */}
        <div className='hidden sm:block sticky top-0 z-[1000] w-full mb-6'>
          <div
            className='w-full px-5 py-3 rounded-2xl border shadow-2xl text-base font-semibold backdrop-blur-md overflow-hidden'
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.18)',
              boxShadow: '0 18px 48px rgba(0,0,0,0.35), 0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.18)'
            }}
          >
            <span className='marquee-single'>Trải nghiệm tốt hơn khi dùng trên điện thoại</span>
          </div>
        </div>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center justify-center gap-3 text-primary'>
          <span className='text-3xl sm:text-4xl'>{icon}</span>
          <span className='text-gradient'>{title}</span>
        </h1>
        <p className='text-sm sm:text-base lg:text-lg text-secondary'>
          {subtitle}
        </p>
      </header>
      {children}
    </div>
  );
};

export default PageLayout;
