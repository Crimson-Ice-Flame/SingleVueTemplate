<template>
  <div class="sidebar">
    <n-scrollbar style="max-height: calc(100vh)" trigger="none">
      <n-menu :options="menuOptions" accordion />
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
// import CommunityIcon from '@/components/icons/IconCommunity.vue'
// import SupportIcon from '@/components/icons/IconSupport.vue'
import { NIcon } from 'naive-ui'

import { usePermissionStore } from '@/stores/permission'
import { permissionGroupMap } from '@/views/permissionManagement/authorityManagement/permissionCheckDisabled'
import { RouterLink } from 'vue-router';

const permissionStore = usePermissionStore()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = ref<any[]>([])

// const handleUpdateValue = (key: string, item: MenuOption) => {
//   console.log('[onUpdate:value]: ' + JSON.stringify(key))
//   console.log('[onUpdate:value]: ' + JSON.stringify(item))
// }

const SideBarMenuMap = (data: any[]) : MenuOption[]=>{
  let menu: MenuOption[] = [];
  data.forEach((item) => {
        // 有檢視權限才要顯示在側邊攔
        const permissionView = item.permissions.some((item: { access_type: string }) => item.access_type === 'PermissionAccessType_View');
        if (permissionView) {
          // 如果有子層項目，則遞迴處理
          if (item.sub_menu_list.length > 0) {
            menu.push({
            label: permissionGroupMap.get(item.name),
            key: `go-back-${item.target}`,
            children: SideBarMenuMap(item.sub_menu_list)
            })
          }else {
            menu.push({
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    name: item.name
                  }
                },
                { default: () => permissionGroupMap.get(item.name) }
              ),
            key: `go-back-${item.target}`,
            })
          }
        }
      })
      return menu;
}

const loadUserPermission = async() => {
  await permissionStore.getUserPermission();
  console.log(permissionStore.userPermissionMap);
  console.log(permissionStore.userPermissions);
    // console.log(filterPermissionRouters(protectedRoutes, permissionStore.userPermissions));
    const result = SideBarMenuMap(permissionStore.userPermissionMap);
    menuOptions.value = result;
}

onMounted(() => {
  loadUserPermission();
})

</script>
