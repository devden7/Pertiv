export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
  is_penalty: boolean;
  token?: string;
}
