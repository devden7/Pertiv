import TableContent from '@/components/admin/TableContent';
import { getStaffs } from '@/lib/actions/admin/admin.action';
import { getUserToken } from '@/lib/actions/auth.action';

const AdminHomePage = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const data = await getStaffs(user.token);

  return (
    <>
      <TableContent data={data.data} token={user.token} />
    </>
  );
};

export default AdminHomePage;
