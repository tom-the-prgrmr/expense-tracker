import { type FC } from 'react';

interface RadialProgressProps {
  percent: number; // 0..100
  size?: number; // px
  trackColor?: string;
  barColor?: string;
}

const RadialProgress: FC<RadialProgressProps> = ({ percent, size = 160, trackColor = '#F1F5F9', barColor = '#22C55E' }) => {
  const normalized = Math.max(0, Math.min(100, percent));
  // SVG viewBox 36x36, radius ~ 15.5 used in page
  const dash = (normalized / 100) * 97; // match previous visual scaling

  return (
    <div style={{ width: size, height: size }} className='relative'>
      <svg viewBox='0 0 36 36' className='w-full h-full -rotate-90'>
        <circle cx='18' cy='18' r='15.5' fill='none' stroke={trackColor} strokeWidth='4' />
        <circle
          cx='18'
          cy='18'
          r='15.5'
          fill='none'
          stroke={barColor}
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray={`${dash}, 100`}
        />
      </svg>
      {/* children could be slotted later */}
    </div>
  );
};

export default RadialProgress;
