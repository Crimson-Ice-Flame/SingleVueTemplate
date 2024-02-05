import { post } from '@/utils/http';
import type { UserParam, LoginRep } from '@/models/api/login';

export const apiLogin = (query: UserParam) => {
  return post<LoginRep>('/manager/login', query);
};

// refreshToken
export const apiRefreshToken = () => {
  return post('/user/token/update');
};
