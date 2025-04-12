export interface IStaff {
  id: string;
  index: number;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

export interface ILogs {
  id: string;
  level: string;
  message: string;
  createdAt: string;
}
