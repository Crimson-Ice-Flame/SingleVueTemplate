import { post,get } from '@/utils/http';
import type { UserCreateReq,UserUpdateReq, UserListResult,UserResetPwReq } from '@/models/api/user';
  
  export const apiGetUserList = (req: any) => {
    return post<UserListResult>('/user/list',req);
  };

  export const apiAddUserAccount = (req: UserCreateReq) => {
    return post('/user/create',req);
  };
  export const apiUpdateUserAccount = (req: UserUpdateReq) => {
    return post('/user/update',req);
  };

  export const apiResetUserAccount = (req: UserResetPwReq) => {
    return post('/user/resetpw',req);
  };
  
  export const apiDeleteUserAccount = (id: number) => {
    return post('/user/delete',{id:id});
  };
  export const apiEnableUserAccount = (id: number) => {
    return post('/user/enable',{id:id});
  };

  export const apiGetUserAccount = (id: number) => {
    return get(`/user/get?id=${id}`);
  };