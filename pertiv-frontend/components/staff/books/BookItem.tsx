'use client';

import { IBooksBorrowing, IBooksSelling } from '@/model/staff.model';
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
import {
  deleteBookBorrowing,
  deleteBookSelling,
} from '@/lib/actions/staff.action';
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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/utils/formatDateTime';
import { badgeStatusColor } from '@/utils/badgeStatusColor';
import DataNotFound from '@/components/shared/DataNotFound';

interface Props {
  token: string;
  item: IBooksSelling | IBooksBorrowing;
  mode: string;
}

const BookItem = ({ item, token, mode }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('Edit');
  const { toast } = useToast();
  const deleteBookHandler = async (id: string) => {
    const response =
      mode === 'bookBorrowing'
        ? await deleteBookBorrowing(id, token)
        : await deleteBookSelling(id, token);
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
        <TableCell className="table-cell ">
          <div className="relative  aspect-[2/3] overflow-hidden">
            <Image
              src={ImageHandler(item.imageUrl)}
              alt={item.title}
              fill
              sizes="50vw"
              quality={100}
              className="object-cover p-2"
            />
          </div>
        </TableCell>
        <TableCell className="max-w-52 break_text">{item.title}</TableCell>
        <TableCell className="text-center">{item.language}</TableCell>
        <TableCell className="text-center">{item.stock}</TableCell>
        {mode !== 'bookBorrowing' && (
          <TableCell className="text-center">
            Rp {formatNumberToRupiah((item as IBooksSelling).price)}
          </TableCell>
        )}
        {mode === 'bookBorrowing' && (
          <TableCell className="text-center">
            {(item as IBooksBorrowing).book_position}
          </TableCell>
        )}
        <TableCell className="text-center">{item.publisher.name}</TableCell>
        <TableCell className="text-center">{item.writer.name}</TableCell>
        <TableCell className="text-center">
          {item.category.map((category) => (
            <Badge key={category} variant="outline" className="mr-2">
              {category}
            </Badge>
          ))}
        </TableCell>
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
                  <DialogTrigger
                    className="w-full text-left"
                    onClick={() => setDialogMode('Edit')}
                  >
                    Edit
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => deleteBookHandler(item.id)}
                >
                  Delete
                </DropdownMenuItem>
                {mode === 'bookBorrowing' && (
                  <DropdownMenuItem>
                    <DialogTrigger
                      className="w-full text-left"
                      onClick={() => setDialogMode('History')}
                    >
                      History borrowing
                    </DialogTrigger>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="overflow-auto max-h-[500px]">
              {dialogMode === 'Edit' && (
                <>
                  <DialogHeader>
                    <DialogTitle>Update book</DialogTitle>
                    <DialogDescription>Update a new book</DialogDescription>
                  </DialogHeader>
                  <BookForm
                    book={{
                      ...item,
                      publisher: item.publisher.name,
                      writer: item.writer.name,
                    }}
                    setIsOpen={setIsOpen}
                    type="Edit"
                    mode={mode}
                    token={token}
                  />
                </>
              )}

              {dialogMode === 'History' && (
                <>
                  <DialogHeader>
                    <DialogTitle>History Borrowing book</DialogTitle>
                  </DialogHeader>
                  <div>
                    {(item as IBooksBorrowing).items.length === 0 && (
                      <DataNotFound data={(item as IBooksBorrowing).items} />
                    )}
                    <div className="flex flex-col gap-3">
                      {(item as IBooksBorrowing).items.map((history) => (
                        <Card
                          key={history.bookBorrowed.id}
                          className="p-3 flex flex-col gap-3"
                        >
                          <p>
                            User :{' '}
                            <span className="font-semibold">
                              {history.bookBorrowed.user.name}
                            </span>
                          </p>
                          <p>
                            status :{' '}
                            <span
                              className={`${badgeStatusColor(
                                history.bookBorrowed.status
                              )} font-semibold p-1 rounded-md`}
                            >
                              {history.bookBorrowed.status}
                            </span>
                          </p>
                          <p>
                            Loan date :{' '}
                            <span className="font-semibold">
                              {formatDateTime(history.bookBorrowed.created_at)}
                            </span>
                          </p>
                          <p>
                            Returned date :{' '}
                            <span className="font-semibold">
                              {formatDateTime(
                                history.bookBorrowed.date_returned
                              )}
                            </span>
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  );
};

export default BookItem;
