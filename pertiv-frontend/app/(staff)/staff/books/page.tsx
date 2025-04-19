import BooksContent from '@/components/staff/books/BooksContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksBorrowing, getBooksSelling } from '@/lib/actions/staff.action';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const StaffBooks = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const modeBook = searchParams.mode || '';
  const SIZE = 10;
  const data =
    modeBook === 'bookBorrowing'
      ? await getBooksBorrowing(page, search, user.token)
      : await getBooksSelling(page, search, user.token);

  return (
    <>
      <BooksContent
        data={data.data}
        token={user.token}
        page={page}
        pageSize={SIZE}
        totalCount={data.totalCount}
        mode={modeBook}
        key={modeBook}
      />
    </>
  );
};

export default StaffBooks;
