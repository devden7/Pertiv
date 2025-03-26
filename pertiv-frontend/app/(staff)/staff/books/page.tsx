import AddBook from '@/components/staff/books/AddBook';
import BooksContent from '@/components/staff/books/BooksContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSelling } from '@/lib/actions/staff.action';

const StaffBooks = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const data = await getBooksSelling(user.token);
  return (
    <section>
      <h2 className="text-xl font-medium">Books</h2>
      <p className=" text-slate-500 mb-3">
        As a Staff, you can manage this book collection.
      </p>
      <AddBook token={user.token} />
      <BooksContent data={data.data} token={user.token} />
    </section>
  );
};

export default StaffBooks;
