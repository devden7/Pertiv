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
