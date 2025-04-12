import { TableRow, TableCell } from '@/components/ui/table';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import { ImageHandler } from '@/utils/imageHandler';
import Image from 'next/image';

interface Props {
  book_title: string;
  book_imageUrl: string;
  book_price: number;
  quantity: number;
  mode: string;
}
const TableOrderBookItem = ({
  book_title,
  book_imageUrl,
  book_price,
  quantity,
  mode,
}: Props) => {
  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">
        <div className="relative aspect-square rounded-md object-cover size-16">
          <Image src={ImageHandler(book_imageUrl)} alt={book_title} fill />
        </div>
      </TableCell>
      <TableCell className="font-medium max-w-40 break_text">
        {book_title}
      </TableCell>
      {mode !== 'bookBorrowing' && <TableCell>{quantity}</TableCell>}
      {mode !== 'bookBorrowing' && (
        <TableCell>Rp {formatNumberToRupiah(book_price)}</TableCell>
      )}
    </TableRow>
  );
};

export default TableOrderBookItem;
