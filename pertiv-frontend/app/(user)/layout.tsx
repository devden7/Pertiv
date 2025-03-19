import UserNavbar from '@/components/user/UserNavbar';
import { ReactNode } from 'react';

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <UserNavbar />
      <main>{children}</main>
    </>
  );
};

export default UserLayout;
