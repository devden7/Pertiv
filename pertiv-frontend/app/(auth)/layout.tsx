import AuthNavbar from '@/components/auth/AuthNavbar';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthNavbar />
      <main className="flex justify-center items-center h-[calc(100vh-4rem)] ">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
