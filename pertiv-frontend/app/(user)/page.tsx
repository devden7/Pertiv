import BooksHomePage from '@/components/shared/BooksHomePage';
import Hero from '@/components/user/home/Hero';
import Pricing from '@/components/user/home/Pricing';
import { getUserToken } from '@/lib/actions/auth.action';
import {
  getBooksBorrowingUser,
  getBooksSellingUser,
  getMembershipTypeForUser,
} from '@/lib/actions/user.action';

const UserHomePage = async () => {
  const user = await getUserToken();

  const data = await getBooksSellingUser('', 1, 5);
  const dataBookBorrowing = await getBooksBorrowingUser('', 1, 5);
  const pricing = await getMembershipTypeForUser();
  console.log(pricing);
  return (
    <>
      <Hero />
      <BooksHomePage
        books={data.data}
        title="Buy a book"
        url="/books-selling"
        detailUrl={'/book-selling'}
        token={user ? user.token : undefined}
      />
      <BooksHomePage
        books={dataBookBorrowing.data}
        title="Borrow a book"
        url="/books-borrowing"
        detailUrl={'/book-borrowing'}
        token={user ? user.token : undefined}
      />
      <Pricing data={pricing.data} token={user ? user.token : undefined} />
    </>
  );
};

export default UserHomePage;
