<template>
  <div class="sidebar">
    <n-scrollbar style="max-height: calc(100vh)" trigger="none">
      <n-menu :options="menuOptions" accordion />
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'

import { usePermissionStore } from '@/stores/permissionStore'
import { permissionGroupMap } from '@/views/permissionManagement/authorityManagement/permissionCheckDisabled'
import { RouterLink } from 'vue-router';
import { renderIcon } from '@/components/icons/IconIndex';

const permissionStore = usePermissionStore()

const menuOptions = ref<any[]>([])


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
            icon: renderIcon(item.name),
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
            icon: renderIcon(item.name),
            })
          }
        }
      })
      return menu;
}

const loadUserPermission = async() => {
  await permissionStore.getUserPermission();
    const result = SideBarMenuMap(permissionStore.userPermissionMap);
    menuOptions.value = result;
}

onMounted(() => {
  loadUserPermission();
})

</script>
