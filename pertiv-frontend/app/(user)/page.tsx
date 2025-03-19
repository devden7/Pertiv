import BooksForSelling from '@/components/user/BooksForSelling';
import Hero from '@/components/user/Hero';
import { getBooksSellingUser } from '@/lib/actions/user.action';

const UserHomePage = async () => {
  const data = await getBooksSellingUser(5);
  return (
    <>
      <Hero />
      <BooksForSelling data={data.data} />
    </>
  );
};

export default UserHomePage;
