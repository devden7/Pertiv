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
}
