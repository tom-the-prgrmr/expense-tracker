import { type FC } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';

const Account: FC = () => {
  return (
    <PageLayout
      title="Quản lý tài khoản"
      icon="👤"
      subtitle="Cài đặt tài khoản, thông tin cá nhân và tùy chọn hệ thống"
    >
      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-600'>
          Thông tin tài khoản và cài đặt sẽ được hiển thị ở đây.
        </p>
      </div>
    </PageLayout>
  );
};

export default Account;
