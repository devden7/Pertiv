import AdminNavbar from '@/components/admin/AdminNavbar';
import { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
};

export default AdminLayout;
