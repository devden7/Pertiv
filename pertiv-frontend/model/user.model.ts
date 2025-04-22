export interface IBookForSelling {
  id: string;
  title: string;
  description: string;
  language: string;
  stock: number;
  imageUrl: string | null;
  price: number;
  created_at: string;
  user_id: string;
  published_id: string;
  writer_id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  publisher: {
    name: string;
  };
  writer: {
    name: string;
  };
  category: {
    categories: {
      id: string;
      name: string;
    };
  }[];
  totalItemSold: number;
}

export interface ITransaction {
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
  item_Order: IItemOrder[];
}

export interface IItemOrder {
  id: string;
  book_title: string;
  book_imageUrl: string;
  book_price: number;
  quantity: number;
}

export interface IBorrowTransaction {
  id: string;
  status: string;
  loan_key: string;
  loan_handled_by: string;
  loan_date: string;
  created_at: string;
  ended_at: string;
  canceled_at: string;
  return_handled_by: string;
  date_returned: string;
  returned_key: string;
  items: IItemBorrow[];
}

export interface IItemBorrow {
  id: string;
  book_title: string;
  book_imageUrl: string;
}

export interface ICartList {
  cart_items: ICartDetail[];
}

export interface ICartDetail {
  id: string;
  quantity: number;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
}

export interface ILoanCartList {
  collection_item: ILoanCartDetail[];
}

export interface ILoanCartDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface IPaymentUser {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  ended_at: string;
  item_Order: [
    {
      id: string;
      book_title: string;
      book_imageUrl: string;
      book_price: 0;
      quantity: 0;
    }
  ];
}

export type bookItemSelling = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number;
  category: { categories: { name: string } }[];
  totalItemSold: number;
};

export type bookItemBorrowing = {
  id: string;
  title: string;
  imageUrl: string | null;
  is_member: boolean;
  category: { categories: { name: string } }[];
  totalItemBorrow: number;
};

export interface IBookForBorrowing {
  id: string;
  title: string;
  description: string;
  book_position: string;
  language: string;
  stock: number;
  imageUrl: string | null;
  is_member: boolean;
  created_at: string;
  user_id: string;
  published_id: string;
  writer_id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  publisher: {
    name: string;
  };
  writer: {
    name: string;
  };
  category: {
    categories: {
      id: string;
      name: string;
    };
  }[];
  totalItemBorrow: number;
}

export interface IUserInfo {
  penalty: IPenaltyType;
  membership: IMembershipType[];
}

export interface IPenaltyType {
  id: string;
  type: string;
  price: number;
  start_date: string;
  end_date: string;
}

export interface IMembershipType {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  maxBorrow: number;
  maxReturn: number;
  price: number;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  membership_id: string;
}
