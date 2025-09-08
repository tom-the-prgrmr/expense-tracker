import { type FC } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';

const AddExpense: FC = () => {
  return (
    <PageLayout
      title="Ghi nhận chi tiêu"
      icon="💰"
      subtitle="Thêm chi tiêu mới và quản lý ngân sách của bạn"
    >
      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-600'>
          Form để thêm chi tiêu mới sẽ được hiển thị ở đây.
        </p>
      </div>
    </PageLayout>
  );
};

export default AddExpense;
