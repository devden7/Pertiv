'use client';

import { IBooksSelling } from '@/model/staff.model';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableRow, TableCell } from '@/components/ui/table';
import { Ellipsis } from 'lucide-react';
import BookForm from './BookForm';
import { deleteBookSelling } from '@/lib/actions/staff.action';
import { useToast } from '@/hooks/use-toast';
import { ImageHandler } from '@/utils/imageHandler';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      <TableRow className="font-medium text-zinc-800">
        <TableCell className="hidden md:table-cell">
          <div className="relative aspect-square rounded-md object-cover size-16">
            <Image src={ImageHandler(imageUrl)} alt={title} fill />
          </div>
        </TableCell>
        <TableCell>{title}</TableCell>
        <TableCell className="text-center">{language}</TableCell>
        <TableCell className="text-center">{stock}</TableCell>
        <TableCell className="text-center">
          Rp {formatNumberToRupiah(price)}
        </TableCell>
        <TableCell className="text-center">{publisher.name}</TableCell>
        <TableCell className="text-center">{writer.name}</TableCell>
        <TableCell className="text-center">{category}</TableCell>
        <TableCell>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <Ellipsis size={15} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left">
                <DropdownMenuItem className="cursor-pointer">
                  <DialogTrigger className="w-full text-left">
                    Edit
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => deleteBookHandler(id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="overflow-auto max-h-[500px]">
              <DialogHeader>
                <DialogTitle>Update book</DialogTitle>
                <DialogDescription>Update a new book</DialogDescription>
              </DialogHeader>
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
                category={category}
                setIsOpen={setIsOpen}
                type="Edit"
              />
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  );
};

export default BookItem;
