import TableContent from '@/components/admin/home/TableContent';
import { getStaffs } from '@/lib/actions/admin/admin.action';
import { getUserToken } from '@/lib/actions/auth.action';
import { notFound } from 'next/navigation';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const AdminHomePage = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return notFound();
  }
  const page = parseInt(searchParams.page) || 1;

  const search = searchParams.search || '';
  const SIZE = 10;

  const data = await getStaffs(search, page, user.token);

  return (
    <>
      <TableContent
        data={data.data}
        token={user.token}
        page={page}
        pageSize={SIZE}
        totalCount={data.totalCount}
      />
    </>
  );
};

export default AdminHomePage;
