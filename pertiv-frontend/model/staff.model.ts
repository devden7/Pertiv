import { z } from 'zod';

export interface IBooksSelling {
  id: string;
  title: string;
  description: string;
  price: number;
  language: string;
  stock: number;
  imageUrl: string | null;
  created_at: string;
  user_id: string;
  publisher: {
    name: string;
  };
  writer: {
    name: string;
  };
  category: string[];
}

export interface IBooksBorrowing {
  id: string;
  title: string;
  description: string;
  book_position: number;
  is_member: number;
  language: string;
  stock: number;
  imageUrl: string | null;
  created_at: string;
  user_id: string;
  publisher: {
    name: string;
  };
  writer: {
    name: string;
  };
  category: string[];
}

export interface ISTransaction {
  id: string;
  status: string;
  buy_key: string;
  buy_handled_by: string;
  buy_date: string;
  total_price: number;
  created_at: string;
  ended_at: string;
  canceled_at: string;
  paid_at: string;
  userId: string;
  user: ISItemUser;
  item_order: ISItemOrder[];
}

export interface ISItemOrder {
  id: string;
  book_title: string;
  book_imageUrl: string;
  book_price: number;
  quantity: number;
}

export interface ISItemUser {
  email: string;
  name: string;
}

export interface IDashboard {
  pieChart: IPieChart;
  areaChart: IAreaChart;
  bookSellingSales: BookSellingSale[];
  staffBookSellingHandle: StaffBookSellingHandle[];
}

export interface IPieChart {
  bookSellingSuccess: number;
}

export interface IAreaChart {
  transactionsBookSelling: TransactionsBookSelling[];
}

export interface TransactionsBookSelling {
  time: string;
  book_selling: number;
}

export interface BookSellingSale {
  quantity: number;
  book_price: number;
  book_title: string;
  calc: number;
}

export interface StaffBookSellingHandle {
  staffName: string;
  totalHandledSuccess: number;
}

export const booksSellingFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'title must be at least 3 characters' })
    .max(255, { message: 'title must be max 255 characters' }),
  description: z
    .string()
    .min(3, { message: 'description must be at least 3 characters' })
    .max(255, { message: 'description must be max 255 characters' }),
  price: z.coerce
    .number()
    .int()
    .min(1000, { message: 'price must be at least RP 1000' })
    .max(1000000, { message: 'price must be max RP 1.000.000' }),
  language: z
    .string()
    .min(3, { message: 'language must be at least 3 characters' })
    .max(255, { message: 'language must be max 255 characters' }),
  stock: z.coerce
    .number()
    .min(0, { message: 'stock at least 0 item' })
    .max(1000, { message: 'stock must be max 1000' }),
  publisherName: z
    .string()
    .min(3, { message: 'publisher name must be at least 3 characters' })
    .max(255, { message: 'publisher name must be max 255 characters' }),
  writerName: z
    .string()
    .min(3, { message: 'writer name must be at least 3 characters' })
    .max(255, { message: 'writer name must be max 255 characters' }),
  categories: z
    .array(
      z
        .string()
        .min(1, { message: 'category is required.' })
        .max(50, { message: 'category cannot exceed 50 characters.' })
    )
    .min(1, { message: 'At least one categories is required.' }),
  image: z.union([
    z.instanceof(File).refine(
      (file) => {
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension && validExtensions.includes(extension);
      },
      {
        message: 'File harus berupa JPG atau PNG',
      }
    ),
    z.null(),
    z.string(),
  ]),
});

export const booksBorrowingFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'title must be at least 3 characters' })
    .max(255, { message: 'title must be max 255 characters' }),
  description: z
    .string()
    .min(3, { message: 'description must be at least 3 characters' })
    .max(255, { message: 'description must be max 255 characters' }),
  bookPosition: z
    .string()
    .min(1, { message: 'description must be at least 1 characters' })
    .max(10, { message: 'description must be max 10 characters' }),
  language: z
    .string()
    .min(3, { message: 'language must be at least 3 characters' })
    .max(255, { message: 'language must be max 255 characters' }),
  stock: z.coerce
    .number()
    .min(0, { message: 'stock at least 0 item' })
    .max(1000, { message: 'stock must be max 1000' }),
  publisherName: z
    .string()
    .min(3, { message: 'publisher name must be at least 3 characters' })
    .max(255, { message: 'publisher name must be max 255 characters' }),
  writerName: z
    .string()
    .min(3, { message: 'writer name must be at least 3 characters' })
    .max(255, { message: 'writer name must be max 255 characters' }),
  categories: z
    .array(
      z
        .string()
        .min(1, { message: 'category is required.' })
        .max(50, { message: 'category cannot exceed 50 characters.' })
    )
    .min(1, { message: 'At least one categories is required.' }),
  image: z.union([
    z.instanceof(File).refine(
      (file) => {
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension && validExtensions.includes(extension);
      },
      {
        message: 'File harus berupa JPG atau PNG',
      }
    ),
    z.null(),
    z.string(),
  ]),
  isMember: z.boolean().default(false),
});
