import AddBook from '@/components/staff/books/AddBook';
import BooksContent from '@/components/staff/books/BooksContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSelling } from '@/lib/actions/staff.action';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const StaffBooks = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const page = parseInt(searchParams.page) || 1;
  const SIZE = 10;
  const data = await getBooksSelling(page, user.token);
  return (
    <section>
      <h2 className="text-xl font-medium">Books</h2>
      <p className=" text-slate-500 mb-3">
        As a Staff, you can manage this book collection.
      </p>
      <AddBook token={user.token} />
      <BooksContent
        data={data.data}
        token={user.token}
        page={page}
        pageSize={SIZE}
        totalCount={data.totalCount}
      />
    </section>
  );
};

export default StaffBooks;
