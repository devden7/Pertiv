import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <main className="flex justify-center">{children}</main>;
};

export default AuthLayout;
