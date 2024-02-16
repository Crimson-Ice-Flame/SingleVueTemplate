import type { PermissionList, PermissionSearchParams, PermissionsSet, PermissionsEdit } from '@/models/api/permissions';
import { post,get, buildParams, deleteHttp } from '@/utils/http';

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



export const apiGetPermissionsGroup = (parameter: any) => {
  return get<PermissionList>('/permissions/group?' + buildParams(parameter));
};

export const apiPostPermissionsStatus = (parameter: PermissionStatus) => {
  return post('/permissions/group/status', parameter);
};

export const apiDeletePermissionsGroup = (parameter: number) => {
  return deleteHttp('/permissions/group/delete?org_group_id=' + parameter);
};

export const apiGetPermissionsOrgGroup = (parameter: number, permissionId: number) => {
  return get(
    `/permissions/ui/org_group?org_company_id=${parameter}&menu_permission_id=${permissionId}`
  );
};






