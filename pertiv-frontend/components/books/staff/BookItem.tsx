import { IBooksSelling } from '@/model/staff.model';
import Image from 'next/image';
import React from 'react';
import noImage from '../../../public/assets/no-image.png';
import { ENV } from '@/utils/config';

const BookItem = ({
  title,
  description,
  language,
  stock,
  imageUrl,
  created_at,
  user_id,
  publisher_id,
  writed_id,
}: IBooksSelling) => {
  return (
    <div className="flex w-full gap-3 border-b-2 border-slate-100 p-3 last:border-b-0 md:w-2/5 md:rounded-2xl md:border-2 md:border-slate-100 md:last:border-b-2 lg:h-[395px] lg:w-[22%] lg:flex-col lg:items-center lg:rounded-2xl lg:border-2 lg:p-2">
      <div className="relative h-40 w-48 overflow-hidden rounded-xl md:w-56 lg:h-[600px] lg:w-full">
        <Image
          src={imageUrl ? `${ENV.API_URL}${imageUrl}` : noImage}
          alt={title}
          width={500}
          height={500}
        />
      </div>
      <div className="size-full">
        <h3 className="mb-3 line-clamp-2 font-semibold">{title}</h3>
        <div className="mb-3 flex max-h-96 flex-wrap gap-2">
          <p className="line-clamp-2 text-xs text-black/70 lg:line-clamp-1 lg:text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
