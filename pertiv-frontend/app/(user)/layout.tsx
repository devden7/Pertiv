import UserNavbar from '@/components/user/UserNavbar';
import { getPenaltyInfo, getUserToken } from '@/lib/actions/auth.action';
import { ReactNode } from 'react';

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUserToken();
  const isPenalty = user ? await getPenaltyInfo(user?.token) : [];
  return (
    <>
      <UserNavbar isPenalty={isPenalty.data} auth={user} />
      <main>{children}</main>
    </>
  );
};

export default UserLayout;
