'use client';

import { IBooksSelling } from '@/model/staff.model';
import Image from 'next/image';
import React, { useState } from 'react';
import noImage from '../../../public/assets/no-image.png';
import { ENV } from '@/utils/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import DialogComponent from '@/components/DialogComponent';
import BookForm from './BookForm';
import { deleteBookSelling } from '@/lib/actions/staff.action';
import { useToast } from '@/hooks/use-toast';

interface Props extends IBooksSelling {
  token: string;
}

const BookItem = ({
  id,
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  user_id,
  publisher,
  writer,
  token,
  category,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const deleteBookHandler = async (id: string) => {
    const response = await deleteBookSelling(id, token);
    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
      });
    }
    if (!response.success && response.statusCode !== 201) {
      return console.log('Error Response ', response.message);
    }

    toast({
      description: response.message,
      duration: 2000,
    });
  };
  return (
    <>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Update book"
        description="Update a new book"
      >
        <BookForm
          id={id}
          title={title}
          description={description}
          language={language}
          stock={stock}
          imageUrl={imageUrl}
          price={price}
          user_id={user_id}
          publisher={publisher.name}
          writer={writer.name}
          token={token}
          setIsOpen={setIsOpen}
          category={category}
          type="Edit"
        />
      </DialogComponent>
      <div className="relative flex w-full gap-3 border-b-2 border-slate-100 p-3 last:border-b-0 md:w-2/5 md:rounded-2xl md:border-2 md:border-slate-100 md:last:border-b-2 lg:h-[395px] lg:w-[22%] lg:flex-col lg:items-center lg:rounded-2xl lg:border-2 lg:p-2">
        <div className="relative h-40 w-48 overflow-hidden rounded-xl md:w-56 lg:h-[600px] lg:w-full">
          <Image
            src={imageUrl ? `${ENV.API_URL}${imageUrl}` : noImage}
            alt={title}
            width={500}
            height={500}
          />
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <div className="absolute left-[12%] top-[8%] z-50 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1 rounded-lg bg-white p-1 text-sm font-medium text-black">
              <Ellipsis size={15} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -top-7 left-5  lg:left-4 xl:left-5">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => deleteBookHandler(id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="size-full">
          <h3 className="mb-3 line-clamp-2 font-semibold">{title}</h3>
          <div className="mb-3 flex max-h-96 flex-wrap gap-2">
            <p className="line-clamp-2 text-xs text-black/70 lg:line-clamp-1 lg:text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookItem;
