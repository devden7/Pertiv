import BooksContent from '@/components/books/staff/BooksContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSelling } from '@/lib/actions/staff.action';

const StaffBooks = async () => {
  const userToken = await getUserToken();
  const data = await getBooksSelling(userToken);
  return (
    <section>
      <h2 className="text-xl font-medium">Books</h2>
      <p className=" text-slate-500 mb-3">
        As a Staff, you can manage this book collection.
      </p>

      <BooksContent data={data.data} />
    </section>
  );
};

export default StaffBooks;
