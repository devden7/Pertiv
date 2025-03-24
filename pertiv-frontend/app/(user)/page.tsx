import BooksForSelling from '@/components/user/BooksForSelling';
import Hero from '@/components/user/Hero';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSellingUser } from '@/lib/actions/user.action';

const UserHomePage = async () => {
  const user = await getUserToken();

  const data = await getBooksSellingUser(5);
  return (
    <>
      <Hero />
      <BooksForSelling data={data.data} token={user ? user.token : undefined} />
    </>
  );
};

export default UserHomePage;
