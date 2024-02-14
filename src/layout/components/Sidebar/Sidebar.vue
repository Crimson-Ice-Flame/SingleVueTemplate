<template>
  <div class="sidebar">
    <!-- <el-scrollbar>
      <el-menu router :default-active="activeMenu">
        <SidebarItem :menuData="menuRoutes" />
      </el-menu>
    </el-scrollbar> -->
  </div>
</template>

<script lang="ts" setup>
// import { ref, computed, watch, onMounted } from 'vue';
// import { useStore } from '@/stores/user';
// import { useRoute } from 'vue-router';
// import { asyncRoutes, protectedRoutes, filterPermissionRouters } from '@/router';

// import SidebarItem from '../Sidebar/SidebarItem.vue';

// const store = useStore();
// const route = useRoute();

// const isProtected = computed(() => store.state.auth.protected);

// const menuRoutes = ref<any>([]);

// const activeMenu = computed(() => {
//   const activePath = route.path === '/dashboard/index' ? '/dashboard' : route.path;
//   return activePath;
// });

// /** 遞迴篩選 - 不顯示要被隱藏的選項 */
// const filterMenu = (menuList: any, parentPath: string = '') => {
//   return menuList
//     .filter((item: any) => {
//       return item.meta.hidden !== true;
//     })
//     .map((item: any) => {
//       if (item.path.slice(0, 1) !== '/') {
//         item.path = `${parentPath}/${item.path}`;
//       }
//       if (item.children) {
//         item.children = filterMenu(item.children, item.path);
//       }
//       return {
//         title: item.meta.title,
//         path: item.path,
//         icon: item.meta.icon ?? null,
//         children: item.children ?? null
//       };
//     });
// };

// // 設定 Sidebar 選項
// const sidebarSetting = () => {
//   if (isProtected.value) {
//     menuRoutes.value = filterMenu(
//       filterPermissionRouters(protectedRoutes, store.getters['permission/USER_PERMISSIONS'])
//     );
//   } else {
//     menuRoutes.value = filterMenu(
//       filterPermissionRouters(asyncRoutes, store.getters['permission/USER_PERMISSIONS'])
//     );
//   }
// };

// // Hooks
// onMounted(() => {
//   sidebarSetting();
// });

// // Watch
// watch(
//   () => store.state.auth.protected, // 監聽保護模式的 state
//   () => {
//     sidebarSetting();
//   }
// );
</script>
