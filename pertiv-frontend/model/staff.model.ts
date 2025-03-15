export interface IBooksSelling {
  id: string;
  title: string;
  description: string;
  language: string;
  stock: number;
  imageUrl: string | null;
  created_at: string;
  user_id: string;
  publisher_id: string;
  writed_id: string;
}
