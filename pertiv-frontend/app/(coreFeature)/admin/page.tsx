import TableContent from '@/components/admin/TableContent';
import { getStaffs } from '@/lib/actions/admin/admin.action';
import { getUserToken } from '@/lib/actions/auth.action';

const AdminHomePage = async () => {
  const userToken = await getUserToken();

  const data = await getStaffs(userToken);
  if (data.statusCode !== 200 && !data.success) {
    return console.log('Error role');
  }

  if (!userToken) return;
  return (
    <>
      <TableContent data={data.data} token={userToken} />
    </>
  );
};

export default AdminHomePage;
