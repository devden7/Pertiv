export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
  token?: string;
}
