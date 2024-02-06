<template>
  <template v-for="menu in menuData" :key="menu.path">
    <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
      <i v-if="menu.icon" :class="['icon', menu.icon]"></i>
      <span>{{ menu.title }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="menu.path">
      <template #title>
        <i v-if="menu.icon" :class="['icon', menu.icon]"></i>
        <span>{{ menu.title }}</span>
      </template>
      <SidebarItem v-if="menu.children && menu.children.length > 0" :menuData="menu.children" />
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
interface menu {
  title: string;
  path: string;
  icon?: string | null;
  children?: menu[] | null;
}

const props = withDefaults(
  defineProps<{
    menuData: menu[];
  }>(),
  {
    menuData: () => []
  }
);
</script>
