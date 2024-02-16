import { defineStore } from 'pinia';
import { apiGetUserPermission } from '@/apis/permission';

interface PermissionStateTypes {
    userPermissionMap: any;
}

// 展開權限 Map
function flatPermissions(userPermissions: any, permissionMap: any) {
    permissionMap.forEach((item: any) => {
        const target = item.target;
        const permissions: { [key: string]: any } = {}; // Add type annotation for permissions object

        Object.entries(item.permissions).forEach((item: any) => {
            permissions[item[0]] = item[1].menu_permissions_id;
        });
        userPermissions[target] = permissions;

        if (item.sub_menus && item.sub_menus.length > 0) {
            flatPermissions(userPermissions, item.sub_menus);
        }
    });
}

export const usePermissionStore = defineStore({
    id: 'permission',
    state: (): PermissionStateTypes => ({
        userPermissionMap: [],
    }),
    getters: {
        userPermissions() {
            const result = {};
            flatPermissions(result, this.userPermissionMap);
            return result;
        },
    },
    actions: {
        setUserPermission(payload: any) {
            this.userPermissionMap = payload;
        },
        async getUserPermission() {
            const res: any = await apiGetUserPermission();
            if (res.status === 1) {
                this.setUserPermission(res.result);
                return true;
            } else {
                return false;
            }
        },
    },
});