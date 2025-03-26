import BooksHomePage from '@/components/shared/BooksHomePage';
import Hero from '@/components/user/home/Hero';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSellingUser } from '@/lib/actions/user.action';

const UserHomePage = async () => {
  const user = await getUserToken();

  const data = await getBooksSellingUser(5);
  return (
    <>
      <Hero />
      <BooksHomePage
        books={data.data}
        title="Buying a book"
        url="/books-selling"
        token={user ? user.token : undefined}
      />
    </>
  );
};

export default UserHomePage;
