import AdminNavbar from '@/components/admin/home/AdminNavbar';
import { getUserToken } from '@/lib/actions/auth.action';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUserToken();
  if (!user) {
    return notFound();
  }
  return (
    <>
      <AdminNavbar auth={user} />
      <main>{children}</main>
    </>
  );
};

export default AdminLayout;
