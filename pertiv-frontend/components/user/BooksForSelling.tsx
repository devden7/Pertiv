import { IBookForSelling } from '@/model/user.model';
import BookSellItem from './BookSellItem';

interface Props {
  data: IBookForSelling[];
}
const BooksForSelling = ({ data }: Props) => {
  return (
    <section className="mt-5">
      <div className="container">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-2 text-lg">Buying a book</h2>
          <p className="text-sm text-primary-500">Show more...</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {data.map((book: IBookForSelling) => (
            <BookSellItem
              key={book.id}
              id={book.id}
              title={book.title}
              imageUrl={book.imageUrl}
              price={book.price}
              category={book.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksForSelling;
