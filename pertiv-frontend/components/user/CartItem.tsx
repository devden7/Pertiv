import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { ImageHandler } from '@/utils/imageHandler';
interface Props {
  id: string;
  quantity: number;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
}
const CartItem = ({
  id,
  quantity,
  title,
  description,
  imageUrl,
  price,
}: Props) => {
  return (
    <div className="mb-4 flex justify-between items-center border-b-[1.5px] border-gray-200">
      <div className="relative mb-4 size-24 overflow-hidden rounded-xl">
        <Image
          className="object-cover"
          src={ImageHandler(imageUrl)}
          alt="book"
          fill
          sizes="50vw"
          quality={90}
        />
      </div>
      <div>
        <h1 className="font-semibold">{title}</h1>
        <p className="text-xs text-gray-500">{description}</p>
        <p className="text-xs text-gray-800 mt-5">
          <span className="text-primary-500 font-medium">Qty {quantity}</span> X{' '}
          {price}
        </p>
      </div>
      <div>
        <div className="mb-3 flex justify-between gap-2">
          <button className="flex size-6 items-center justify-center border border-gray-200">
            <Minus />
          </button>
          <div>
            <span>1</span>
          </div>
          <button className="flex size-6 items-center justify-center border border-gray-200">
            <Plus />
          </button>
        </div>
        <p className="text-primary-600 text-center">Remove</p>
      </div>
    </div>
  );
};

export default CartItem;
