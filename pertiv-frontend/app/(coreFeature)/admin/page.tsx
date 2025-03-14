import TableContent from '@/components/admin/TableContent';
import { getStaffs } from '@/lib/actions/admin/admin.action';

const AdminHomePage = async () => {
  const data = await getStaffs();
  return (
    <>
      <TableContent data={data.data} />
    </>
  );
};

export default AdminHomePage;
