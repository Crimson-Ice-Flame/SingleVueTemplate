<template>
  <div class="navbar">
    <div class="content">
      <div class="logo">
        <img src="@/assets/images/logo/free_logo2.png" />
      </div>
      <el-dropdown class="user_dropdown">
        <a class="user_dropdown_link">{{ authStore.getUserAccount.charAt(0) }}</a>
        <template #dropdown>
          <el-dropdown-menu class="user_dropdown_menu">
            <li class="user_account">{{ authStore.getUserAccount }}</li>
            <el-dropdown-item @click="logOut">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useRouter } from 'vue-router';
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
// Types
import { appAuthStore } from '@/stores/user'
// const router = useRouter();

const authStore = appAuthStore()

const logOut = () => {
  authStore.LOGOUT()
}

// const directivePage = (routerName:string) => {
//  router.push({ name: routerName });
// };
</script>

<style scoped lang="scss">
.btnGroup {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
