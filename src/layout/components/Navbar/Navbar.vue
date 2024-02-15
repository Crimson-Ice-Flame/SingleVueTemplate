<template>
  <div class="navbar">
    <div class="content">
      <!-- <n-button quaternary type="warning" @click="directivePage('home')">
        裝置設定
      </n-button> -->
          <el-dropdown class="user_dropdown">
            <a class="user_dropdown_link">{{ userAccount.charAt(0) }}</a>
            <template #dropdown>
              <el-dropdown-menu class="user_dropdown_menu">
                <li class="user_account">{{ userAccount }}</li>
                <el-dropdown-item @click="logOut">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {  computed } from 'vue';
// import { useRouter } from 'vue-router';
import { ElDropdown,ElDropdownMenu,ElDropdownItem } from 'element-plus'
// Types
import { appAuthStore } from '@/stores/user';
// const router = useRouter();

const authStore = appAuthStore();

const userAccount = computed(() => {
  if(authStore.account.trim() === '') {
    return localStorage.getItem('account') || 'Account';
  }
  return authStore.account
});

const logOut = () => {
  authStore.LOGOUT();
};


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
