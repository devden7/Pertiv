import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  addBookBorrowing,
  addBookSelling,
  updateBookBorrowing,
  updateBookSelling,
} from '@/lib/actions/staff.action';
import { useToast } from '@/hooks/use-toast';
import {
  booksBorrowingFormSchema,
  booksSellingFormSchema,
} from '@/model/staff.model';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

type bookFormSelling = {
  id?: string;
  title?: string;
  description?: string;
  language?: string;
  stock?: number;
  imageUrl: string | null;
  price?: number;
  user_id?: string;
  publisher?: string;
  writer?: string;
  category?: string[];
};

type bookFormBorrowing = {
  id?: string;
  title?: string;
  description?: string;
  language?: string;
  stock?: number;
  imageUrl: string | null;
  book_position?: string;
  user_id?: string;
  publisher?: string;
  writer?: string;
  category?: string[];
  is_member?: boolean;
};
interface Props {
  type: string;
  token?: string;
  book?: bookFormSelling | bookFormBorrowing;
  mode?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const BookForm = ({ type, token, book, mode, setIsOpen }: Props) => {
  const [isForBorrowing, setIsForBorrowing] = useState(false);
  const { toast } = useToast();

  const getBooksSchema = (mode: string, isForBorrowing: boolean) => {
    if (mode === 'bookBorrowing') {
      return booksBorrowingFormSchema;
    }

    if (isForBorrowing) {
      return booksSellingFormSchema.extend({
        bookPosition: z
          .string()
          .min(3, { message: 'Book position is required' })
          .max(10, { message: 'Book position must be max 10 characters' }),
      });
    }

    return booksSellingFormSchema;
  };
  const schema = getBooksSchema(mode!, isForBorrowing);

  const defaultFormValue =
    mode === 'bookBorrowing'
      ? {
          title: book ? book.title : '',
          description: book ? book.description : '',
          bookPosition: book ? (book as bookFormBorrowing).book_position : '',
          language: book ? book.language : '',
          stock: book ? book.stock : 0,
          publisherName: book ? book.publisher : '',
          writerName: book ? book.writer : '',
          categories: book ? book.category : [],
          image: book ? book.imageUrl : null,
          isMember: book ? (book as bookFormBorrowing).is_member : false,
        }
      : {
          title: book ? book.title : '',
          description: book ? book.description : '',
          price: book ? (book as bookFormSelling).price : 0,
          language: book ? book.language : '',
          stock: book ? book.stock : 0,
          publisherName: book ? book.publisher : '',
          writerName: book ? book.writer : '',
          categories: book ? book.category : [],
          image: book ? book.imageUrl : null,
          bookPosition: '',
          isMember: false,
        };
  const form = useForm<z.infer<typeof schema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as z.ZodType<any>),
    defaultValues: defaultFormValue,
  });

  const { isSubmitting } = form.formState;

  const handleKeyCategory = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const categoryItem = e.currentTarget.value.trim();

      if (
        categoryItem &&
        categoryItem.length <= 15 &&
        !field.value.includes(categoryItem)
      ) {
        form.setValue('categories', [...field.value, categoryItem]);
        e.currentTarget.value = '';
        form.clearErrors('categories');
      } else if (categoryItem.length > 15) {
        form.setError('categories', {
          type: 'manual',
          message: 'Tag should be less than 15 characters',
        });
      } else if (field.value.includes(categoryItem)) {
        form.setError('categories', {
          type: 'manual',
          message: 'Tag already exists',
        });
      }
    }
  };

  const handleRemoveCategory = (
    category: string,
    field: { value: string[] }
  ) => {
    form.setValue(
      'categories',
      field.value.filter((cat) => cat !== category)
    );
    form.clearErrors('categories');
  };

  const createFormData = (values: z.infer<typeof schema>, mode?: string) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);

    if (mode !== 'bookBorrowing' && 'price' in values) {
      formData.append('price', values.price.toString());
    }

    if ('isMember' in values && 'bookPosition' in values) {
      formData.append('bookPosition', values.bookPosition ?? '');
      formData.append('isMember', (values.isMember ?? false).toString());
    }

    formData.append('language', values.language);
    formData.append('stock', values.stock.toLocaleString());
    formData.append('publisherName', values.publisherName);
    formData.append('writerName', values.writerName);
    values.categories.forEach((category) => {
      formData.append('categories', category);
    });

    if (values.image) {
      formData.append('image', values.image);
    }

    return formData;
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const formData = createFormData(values, mode);
    const formData2 = isForBorrowing ? createFormData(values, mode) : null;

    let response1 = null;
    let response2 = null;

    const isAdd = type === 'Add';
    const id = book?.id;

    if (mode === 'bookBorrowing') {
      response1 = isAdd
        ? await addBookBorrowing(formData, token)
        : id && (await updateBookBorrowing(id, formData, token));
    } else {
      if (isAdd) {
        if (isForBorrowing && formData2) {
          [response1, response2] = await Promise.all([
            addBookSelling(formData, token),
            addBookBorrowing(formData2, token),
          ]);
        } else {
          response1 = await addBookSelling(formData, token);
        }
      } else if (id) {
        response1 = await updateBookSelling(id, formData, token);
      }
    }

    const failedResponses = [
      { res: response1, label: 'bookSelling' },
      { res: response2, label: 'bookBorrowing' },
    ].filter(
      (value) => value.res && !value.res.success && value.res.statusCode !== 201
    );

    if (failedResponses.length > 0 && isForBorrowing) {
      let message = 'Oh! Something went wrong!';

      if (failedResponses.length === 2) {
        message = 'Book title is already exist';
      } else if (failedResponses[0].label === 'bookSelling') {
        message =
          'Book borrowing successfully added, but book title in bookSelling is already exist';
        setIsOpen(false);
      } else if (failedResponses[0].label === 'bookBorrowing') {
        message =
          'Book selling successfully added, but book title in bookBorrowing is already exist';
        setIsOpen(false);
      }

      return toast({
        title: message,
        duration: 5000,
      });
    } else {
      if (
        (response1 && !response1.success && response1.statusCode !== 201) ||
        (response2 && !response2.success && response2.statusCode !== 201)
      ) {
        return toast({
          variant: 'destructive',
          title: response1.message[0].msg || response2.message[0].msg,
          duration: 5000,
        });
      }
    }

    setIsOpen(false);
    toast({
      description: 'Success',
      duration: 2000,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Language of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder="Stock of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publisherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publisher name</FormLabel>
              <FormControl>
                <Input placeholder="Publisher name of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="writerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Writer name</FormLabel>
              <FormControl>
                <Input placeholder="Writer name of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Add categories ..."
                    onKeyDown={(e) => handleKeyCategory(e, field)}
                  />
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {field.value.length > 0 &&
                      field.value.map((category) => (
                        <Badge
                          variant="outline"
                          onClick={() => handleRemoveCategory(category, field)}
                          key={category}
                          className="cursor-pointer"
                        >
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mb-3 space-y-0">
              <FormControl>
                <Input
                  type="file"
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode !== 'bookBorrowing' && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Price of the book" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(mode === 'bookBorrowing' || isForBorrowing) && (
          <FormField
            control={form.control}
            name="bookPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Position</FormLabel>
                <FormControl>
                  <Input placeholder="Book position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(mode === 'bookBorrowing' || isForBorrowing) && (
          <FormField
            control={form.control}
            name="isMember"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Membership only</FormLabel>
                  </div>
                </FormItem>
              );
            }}
          />
        )}
        {mode === 'bookSelling' && type !== 'Edit' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isForBorrowing}
              onCheckedChange={() => setIsForBorrowing(!isForBorrowing)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Also list this book for borrowing
            </label>
          </div>
        )}
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          {type === 'Add' ? 'Add' : 'Update'} Book
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
