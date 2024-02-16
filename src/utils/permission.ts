import { usePermissionStore } from "@/stores/permission";
import { useRouter } from 'vue-router';


const store = usePermissionStore();

/**取得權限的ID
 * @param { string } key - 權限的 target
 * @param { string } fn  - 要取回 ID 的功能 'VIEW, ADD, EDIT, DELETE, REVIEW'
 * @returns {(number | undefined)}
 */
export const getPermissionID = (key: string, fn: string): number | undefined => {
  if (key && fn) {
    const permissions: { [key: string]: { [fn: string]: number | undefined } } = store.userPermissions;
    if (permissions[key] && permissions[key][fn] !== undefined) {
      return permissions[key][fn];
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

/**
 * 檢查是否有權限進入多功能的頁面，沒有權限會被導向404頁面
 * @param {string} target - 權限的 Target
 * @param {(string | string[])} pageType - 頁面的 pageType
 */
export const pageTypePermissionCheck = (target: string, pageType: string | string[]) => {
  if (typeof pageType === 'string') {
    const permissionID = getPermissionID(target, pageType.toUpperCase());
    if (permissionID === undefined) {
      useRouter().replace({ path: '/404' });
    }
  }
};

/**
 * 直接給予有無權限的 boolean，無權限便會到向404頁面
 * @param {Boolean} havePermission - 有無權限
 */
export const pagePermissionCheck = (havePermission: boolean) => {
  if (!havePermission) {
    useRouter().replace({ path: '/404' });
  }
};

/**
 * 檢查多個 Permission Target 是否都有某個功能的權限
 * @param {string[]} keys - 權限 Target 的陣列
 * @param {string} fn - 要檢查的功能
 * @returns {Boolean}
 */
export const multiplePermissionsCheck = (keys: string[], fn: string): boolean => {
  const havePermissions = keys.map((key: string) => {
    const permissionId = getPermissionID(key, fn);
    return permissionId !== undefined;
  });
  return havePermissions.includes(true);
};


