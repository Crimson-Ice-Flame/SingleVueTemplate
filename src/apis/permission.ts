import type {  PermissionSearchParams, PermissionsSet, PermissionsEdit } from '@/models/api/permissions';
import type { SelectOption } from '@/utils/common';
import { post,get } from '@/utils/http';

/** 取得使用者授權地圖 */
export const apiGetUserPermission = () => {
  return get('/permission/user');
};

/** 取得授權地圖 */
export const apiGetPermissionsMap = () => {
  return get('/permission/map');
};

/** 取得權限群組資料 */
export const apiGetPermissions = (groupId: number) => {
  return get(`/permission/get?id=${groupId}`);
};

/** 取得權限群組列表 */
export const apiGetPermissionList = (req: PermissionSearchParams) => {
  return post('/permission/list',req);
};

/** 新增權限群組 */
export const apiPostPermissionsAdd = (data: PermissionsSet) => {
  return post('/permissions/create', data);
};

/** 編輯權限群組 */
export const apiPostPermissionsEdit = (data: PermissionsEdit) => {
  return post('/permissions/edit', data);
};

/** 停啟用權限群組 */
export const apiEnablePermission = (id: number) => {
  return post('/permission/enable',{id:id});
};

/** 刪除權限群組 */
export const apiDeletePermission = (id: number) => {
  return post('/permission/delete',{id:id});
};

/** 權限群組下拉選單 */
const apiGetSelectPermissionGroup = () => {
  return get('/permission/select');
};


/* 通用方法 */
export const permissionGroupOptions = async () : Promise<SelectOption[]> => {
  try {
    const rep = await apiGetSelectPermissionGroup();
    if(rep.status !== 1) {
      return [];
    }
    else{
      return rep.result.map((item: { id: number; name: string; }) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}



