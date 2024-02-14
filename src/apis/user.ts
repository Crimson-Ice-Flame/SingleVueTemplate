import { post,get } from '@/utils/http';
import type { UserParam, LoginRep, UserListReq } from '@/models/api/login';

export const apiLogin = (query: UserParam) => {
    return post<LoginRep>('/user/login', query);
  };
  
  // refreshToken
  export const apiRefreshToken = () => {
    return post('/user/token/update');
  };
  
  export const apiGetUserList = (req: any) => {
    return post<UserListReq>('/user/list',req);
  };
