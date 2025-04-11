import UserNavbar from '@/components/user/UserNavbar';
import { getUserInfo, getUserToken } from '@/lib/actions/auth.action';
import { ReactNode } from 'react';

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUserToken();
  const userInfo = user ? await getUserInfo(user?.token) : [];
  return (
    <>
      <UserNavbar userInfo={userInfo.data} auth={user} />
      <main>{children}</main>
    </>
  );
};

export default UserLayout;
