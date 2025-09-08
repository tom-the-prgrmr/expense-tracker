import { type FC } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';

const TodayExpenses: FC = () => {
  return (
    <PageLayout
      title="Chi tiêu hôm nay"
      icon="📅"
      subtitle="Xem và quản lý các khoản chi tiêu trong ngày"
    >
      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-600'>
          Danh sách chi tiêu trong ngày sẽ được hiển thị ở đây.
        </p>
      </div>
    </PageLayout>
  );
};

export default TodayExpenses;
