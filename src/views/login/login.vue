<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { UserParam } from '@/models/api/login';
import router from '@/router';
//驗證

import {appAuthStore} from '@/stores/user';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { apiLogin } from '@/apis/login'; // Import the apiLogin function

const authStore = appAuthStore();
authStore.REMOVE_LOCAL_DATA();

const localeRef = ref('Chinese')

// const loginFormRef = ref<FormInstance>();



const loginFormModel = reactive<UserParam>({
  account: '',
  password: ''
});

const rules: FormRules = {
  account: {
    required: true,
    trigger: [ 'input'],
    renderMessage: () => {
      return localeRef.value === 'Chinese' ? '請輸入' : 'Please enter'
    }
  },
  password: {
    required: true,
    trigger: [ 'input'],
    renderMessage: () => {
      return localeRef.value === 'Chinese' ? '請輸入' : 'Please enter'
    }
  }
}
const formRef = ref<FormInst | null>(null)
const submitForm = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(
    (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
        let query:UserParam = {
          account: loginFormModel.account,
          password: loginFormModel.password
        }
       

        apiLogin(query).then(res=>{
          if(res.status === 1){
            authStore.$state.account =  loginFormModel.account;
            authStore.LOGIN(res.result);
            router.push({ path: '/dashboard/index' });
          }
        })
      }
    }
  )
}
</script>

<template>
  <div class="login">
    <div class="card">
    <n-form ref="formRef" :model="loginFormModel" :rules="rules">
      <n-form-item path="account" label="帳號">
        <n-input v-model:value="loginFormModel.account" type="text" placeholder="" />
      </n-form-item>
      <n-form-item path="password" label="密碼">
        <n-input
        v-model:value="loginFormModel.password"
        type="password"
        show-password-on="click"
        placeholder=""
        :maxlength="24"
      />
      </n-form-item>
  
      <n-flex justify="center">
        <n-button type="info" :disabled="loginFormModel.account === null"
            @click="submitForm">
            立即登入
          </n-button>
      </n-flex>
  </n-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>
