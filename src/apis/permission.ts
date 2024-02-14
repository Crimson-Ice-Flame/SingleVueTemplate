import { post,get } from '@/utils/http';

export const apiGetUserPermission = () => {
  return get('/permission/user');
};
