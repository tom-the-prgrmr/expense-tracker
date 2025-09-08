import { type FC } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';

const SetBudget: FC = () => {
  return (
    <PageLayout
      title="Thiết lập hạn mức"
      icon="🎯"
      subtitle="Đặt giới hạn chi tiêu cho từng danh mục và theo thời gian"
    >
      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-600'>
          Form để thiết lập hạn mức chi tiêu sẽ được hiển thị ở đây.
        </p>
      </div>
    </PageLayout>
  );
};

export default SetBudget;
