import { type FC } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';

const Reports: FC = () => {
  return (
    <PageLayout
      title="Xem báo cáo"
      icon="📈"
      subtitle="Phân tích chi tiêu, xu hướng và báo cáo chi tiết"
    >
      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-600'>
          Các báo cáo và biểu đồ chi tiêu sẽ được hiển thị ở đây.
        </p>
      </div>
    </PageLayout>
  );
};

export default Reports;
