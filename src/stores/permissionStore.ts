import { defineStore } from 'pinia'
import { apiGetUserPermission } from '@/apis/permission'

interface PermissionStateTypes {
  userPermissionMap: any[]
}

const actionPermissionMap = new Map([
  ['PermissionAccessType_Add', 'ADD'],
  ['PermissionAccessType_Delete', 'DELETE'],
  ['PermissionAccessType_Edit', 'EDIT'],
  ['PermissionAccessType_View', 'VIEW']
])

// 展開權限 Map
function flatPermissions(userPermissions: any, permissionMap: any) {
  permissionMap.forEach((item: any) => {
    const target = item.target
    const permissions: { [key: string]: any } = {} // Add type annotation for permissions object

    item.permissions.forEach((element: { access_type: string; menu_permission_id: number }) => {
      const name = actionPermissionMap.get(element.access_type)
      if (name) permissions[name] = element.menu_permission_id
    })
    userPermissions[target] = permissions

    if (item.sub_menu_list && item.sub_menu_list.length > 0) {
      flatPermissions(userPermissions, item.sub_menu_list)
    }
  })
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionStateTypes => ({
    userPermissionMap: []
  }),
  getters: {
    userPermissions() {
      const result = {}
      if(this.userPermissionMap.length === 0) return JSON.parse(localStorage.getItem('userPermissions') || '{}');
      flatPermissions(result, this.userPermissionMap);
      localStorage.setItem('userPermissions', JSON.stringify(result))
      return result
    }
  },
  actions: {
    setUserPermission(payload: any) {
      this.userPermissionMap = payload
    },
    async getUserPermission() {
      const res: any = await apiGetUserPermission()
      if (res.status === 1) {
        this.setUserPermission(res.result)
        return true
      } else {
        return false
      }
    }
  }
})
