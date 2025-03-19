import Image from 'next/image';

import { ImageHandler } from '@/utils/imageHandler';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface Props {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number;
  category: { categories: { name: string } }[];
}
const BookSellItem = ({ id, title, imageUrl, price, category }: Props) => {
  return (
    <Link href={`/book-selling/${id}`}>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
        <Image
          src={ImageHandler(imageUrl)}
          alt="face cream image"
          fill
          objectFit="cover"
        />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl leading-8 text-black transition-all duration-500">
            {title}
          </p>
          <h6 className="font-semibold text-xl leading-8 text-primary-600">
            {price}
          </h6>
        </div>
        <div className="mt-2 flex gap-2">
          {category.map((cat) => (
            <Badge variant="outline" key={cat.categories.name}>
              {cat.categories.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BookSellItem;
