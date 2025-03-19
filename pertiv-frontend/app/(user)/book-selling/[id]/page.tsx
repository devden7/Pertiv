import BookSellingDetailInformation from '@/components/user/BookSellingDetailInformation';
import { getBookSellingDetail } from '@/lib/actions/user.action';

interface Params {
  params: { id: string };
}
const BookSellingDetail = async ({ params }: Params) => {
  const data = await getBookSellingDetail(params.id);
  if (!data.success && data.statusCode === 404) {
    return <h1 className="text-center">{data.message}</h1>;
  }
  return (
    <>
      <BookSellingDetailInformation
        id={data.data.id}
        title={data.data.title}
        description={data.data.description}
        stock={data.data.stock}
        language={data.data.language}
        imageUrl={data.data.imageUrl}
        publisherName={data.data.publisher.name}
        writerName={data.data.writer.name}
        category={data.data.category}
      />
    </>
  );
};

export default BookSellingDetail;
