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
import { addBookSelling, updateBookSelling } from '@/lib/actions/staff.action';
import { useToast } from '@/hooks/use-toast';
import { booksSellingSchema } from '@/model/staff.model';

interface Props {
  type: string;
  token?: string;
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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const BookForm = ({
  type,
  token,
  id,
  title,
  description,
  language,
  stock,
  imageUrl,
  price,
  publisher,
  writer,
  category,
  setIsOpen,
}: Props) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof booksSellingSchema>>({
    resolver: zodResolver(booksSellingSchema),
    defaultValues: {
      title: title ?? '',
      description: description ?? '',
      price: price || 0,
      language: language ?? '',
      stock: stock ?? 0,
      publisherName: publisher ?? '',
      writerName: writer ?? '',
      categories: category ?? [],
      image: imageUrl ?? null,
    },
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

  const onSubmit = async (values: z.infer<typeof booksSellingSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('language', values.language);
    formData.append('stock', values.stock.toLocaleString());
    formData.append('publisherName', values.publisherName);
    formData.append('writerName', values.writerName);
    formData.append('categories', JSON.stringify(values.categories));
    if (values.image) {
      formData.append('image', values.image);
    }

    const response =
      type === 'Add'
        ? await addBookSelling(formData, token)
        : await updateBookSelling(id!, formData, token);

    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });
    }
    setIsOpen(false);
    toast({
      description: response.message,
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

        <Button type="submit" variant="outline" disabled={isSubmitting}>
          Add Book
        </Button>
      </form>
    </Form>
  );
};

export default BookForm;
