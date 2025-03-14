import { Role } from '@/model/middleware.model';

export const ROLE_PATHS: Record<Role, string> = {
  admin: '/admin',
  staff: '/staff',
  user: '/',
};
