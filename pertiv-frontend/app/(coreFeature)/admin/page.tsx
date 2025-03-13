import TableContent from '@/components/admin/TableContent';
import { getStaffs } from '@/lib/actions/admin/admin.action';

const AdminHomePage = async () => {
  const data = await getStaffs();

  if (data.data.length === 0) {
    return <p className="text-center">No data</p>;
  }
  return (
    <>
      <TableContent data={data.data} />
    </>
  );
};

export default AdminHomePage;
