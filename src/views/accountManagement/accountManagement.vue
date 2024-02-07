<template>
  <div>
    <el-row class="top_form_wrapper" :gutter="10" align="bottom" justify="space-between">
      <el-col :span="20">
        <SearchTool
          :searchModel="searchData"
          :searchList="searchList"
          @handleSearchClick="onSearch"
        />
      </el-col>
      <el-col :span="4" class="buttons">
        <el-button class="btn_edit" @click="toAdd">新增 </el-button>
      </el-col>
    </el-row>
    <ViewTable :haveIndexColumn="true" :tableList="tableList" :tableData="tableData" class="blue">
      <template #group_name="value">
        <div v-for="(i, key) in value.row.group_name" :key="key">{{ i }}</div>
      </template>
      <template #updated_at="value">
        <DateTime :timestamp="value.row.updated_at"></DateTime>
      </template>
      <template #account="value">
        {{ value.row.account }}
      </template>
      <template #enable_state="value">
        <!-- <Switch
          v-permission="`${permissionTarget}:EDIT`"
          v-model:enabled="value.row.enable_state"
          class="green"
          :id="value.row.id"
          :api="switchApi"
        ></Switch> -->
      </template>
      <template #operator="value">
        <div>
          <el-button class="btn_sure mr_1"
            >密碼重置</el-button>
          <button class="btn_operator text_edit">
            <DeleteIcon />
          </button>
          <button  class="btn_operator text_delete">
            <DeleteIcon />
          </button>
        </div>
      </template>
    </ViewTable>
    <PaginationVue
      :pageData="pageData"
      @changeSize="changeSize"
      @changePage="changePage"
    />
    <!-- <OrgDialogVue
      class="purple"
      ref="addDialogRef"
      :dialogModel="titleDialog"
      @closed="addAccountCancel"
    >
      <FormValidVue
        ref="formAddRef"
        class="accountManagement_dialog"
        :rules="rules"
        :formList="formAddList"
        :model="formAddModel"
      >
        <template #password>
          <el-input
            v-model="formAddModel.password"
            :type="newPwEye ? 'text' : 'password'"
            id="confirmPw"
            name="confirmPw"
            :placeholder="t('Password_Limit')"
            :maxlength="16"
          >
            <template #suffix>
              <img
                v-show="!newPwEye"
                @click="newPwSeePassword"
                src="@/assets/images/login/eye_close.svg"
              />
              <img
                v-show="newPwEye"
                @click="newPwSeePassword"
                src="@/assets/images/login/eye_start.svg"
              />
            </template>
          </el-input>
        </template>
        <template #password_check>
          <el-input
            v-model="formAddModel.password_check"
            :type="confirmPwEye ? 'text' : 'password'"
            id="confirmPw"
            name="confirmPw"
            :placeholder="t('Enter_Password_Again')"
            :maxlength="16"
          >
            <template #suffix>
              <img
                v-show="!confirmPwEye"
                @click="confirmPwSeePassword"
                src="@/assets/images/login/eye_close.svg"
              />
              <img
                v-show="confirmPwEye"
                @click="confirmPwSeePassword"
                src="@/assets/images/login/eye_start.svg"
              />
            </template>
          </el-input>
        </template>
      </FormValidVue>
      <div class="btnGroup">
        <el-button class="btn_cancel" @click="addAccountCancel">{{ $t('Cancel') }}</el-button>
        <el-button class="btn_sure" v-debounce="{ callback: () => addAccount() }">{{
          $t('Save')
        }}</el-button>
      </div>
    </OrgDialogVue>
    <OrgDialogVue
      class="purple"
      ref="resetPwDialogRef"
      :dialogModel="resetPwDialog"
      @closed="resetPasswordCancel"
    >
      <FormValidVue
        ref="formResetPwRef"
        class="accountManagement_dialog"
        :rules="formRestPwRules"
        :formList="formRestPwList"
        :model="formRestPwModel"
      >
        <template #password>
          <el-input
            v-model="formRestPwModel.password"
            :type="newPwEye ? 'text' : 'password'"
            id="confirmPw"
            name="confirmPw"
            :placeholder="t('Password_Limit')"
            :maxlength="16"
          >
            <template #suffix>
              <img
                v-show="!newPwEye"
                @click="newPwSeePassword"
                src="@/assets/images/login/eye_close.svg"
              />
              <img
                v-show="newPwEye"
                @click="newPwSeePassword"
                src="@/assets/images/login/eye_start.svg"
              />
            </template>
          </el-input>
        </template>
        <template #password_check>
          <el-input
            v-model="formRestPwModel.password_check"
            :type="confirmPwEye ? 'text' : 'password'"
            id="confirmPw"
            name="confirmPw"
            :placeholder="t('Enter_Password_Again')"
            :maxlength="16"
          >
            <template #suffix>
              <img
                v-show="!confirmPwEye"
                @click="confirmPwSeePassword"
                src="@/assets/images/login/eye_close.svg"
              />
              <img
                v-show="confirmPwEye"
                @click="confirmPwSeePassword"
                src="@/assets/images/login/eye_start.svg"
              />
            </template>
          </el-input> </template
      ></FormValidVue>
      <div class="btnGroup">
        <el-button class="btn_cancel" @click="resetPasswordCancel">
          {{ $t('Cancel') }}
        </el-button>
        <el-button class="btn_sure" v-debounce="{ callback: () => resetPassword() }">{{
          $t('Save')
        }}</el-button>
      </div>
    </OrgDialogVue>
    <OrgDialogVue class="purple" ref="editDialogRef" :dialogModel="editDialog">
      <FormValidVue
        ref="formEditRef"
        class="accountManagement_dialog"
        :rules="formEditRules"
        :formList="formEditList"
        :model="formEditModel"
      ></FormValidVue>
      <div class="btnGroup">
        <el-button class="btn_cancel" @click="editAccountCancel">{{ $t('Cancel') }}</el-button>
        <el-button class="btn_sure" v-debounce="{ callback: () => editAccount() }">{{
          $t('Save')
        }}</el-button>
      </div>
    </OrgDialogVue> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
// import { useStore } from '@/store';
import { useRouter, useRoute } from 'vue-router'
// import { useI18n } from 'vue-i18n';

import _ from 'lodash'
import DeleteIcon from '@/components/icons/IconDelete.vue'


import ViewTable from '@/components/tables/ViewTable.vue'
import SearchTool from '@/components/search/SearchTool.vue'
import Switch from '@/components/switch/SwitchTool.vue'
import DateTime from '@/components/DateTime/DateTime.vue';
import PaginationVue from '@/components/Pagination/PaginationTool.vue';

// import IconDialog from '@/components/Dialogs/IconDialog.vue';
// import OrgDialogVue from '@/components/Dialogs/OrgDialog.vue';
// import FormValidVue from '@/components/Form/FormValid.vue';

// Utils
// import type { AddUser, EditUser, ResetPwUser } from '@/type/apis/user';
import type { SearchField } from '@/models/components/searchTool'
import type { TableField } from '@/models/components/viewTable'
import { type PageDataType } from '@/models/components/pagination';

// import { apiGetUserPermissionsGroup } from '@/api/permissions';
// import {
//   apiUserAdd,
//   apiUserList,
//   apiUserEnable,
//   apiUserResetVerify,
//   apiUserDelete,
//   apiUserResetPassword,
//   apiUserUpdate,
//   apiUserCheckDelete
// } from '@/api/user';
import { showNotification } from '@/utils/common'
// import { getPermissionID } from '@/utils/permission';

const permissionTarget = 'Account_Management'

// const store = useStore();
// const { t } = useI18n();
const route = useRoute()
const router = useRouter()
// const switchApi = ref(apiUserEnable);

const twiceOptions: any = [
  { label: 'Enable', value: 1 },
  { label: 'Disabled', value: 0 }
]
const searchList = ref<SearchField[]>([
  {
    elementName: 'nInput',
    name: 'group_name',
    label: '權限群組'
  },
  {
    elementName: 'nInput',
    name: 'account',
    placeholder: '請輸入帳號',
  },
  {
    elementName: 'nSelect',
    name: 'enable_state',
    label: '啟用狀態',
    selectOptions: twiceOptions,
    option_label: 'label',
    option_value: 'value',
    class: 'form_status'
  }
])
const searchData = ref({
  group_name: '',
  account: '',
  enable_state: ''
})
const onSearch = (value: any) => {
  pageData.pageNo = 1
  getList()
}

const getList = () => {
  // const query = {
  //   ...searchData.value,
  //   pageSize: pageData.pageSize,
  //   pageNo: pageData.pageNo
  // };
  // apiUserList(query).then((res) => {
  //   if (res.status === 1) {
  //     tableData.value = res.data.list;
  //     pageData.pageTotal = res.data.total;
  //   }
  // });
}

const tableList = ref<TableField[]>([
  { label: '帳號', name: 'account', sortable: true },
  { label: '暱稱', name: 'nickname' },
  { label: '權限群組', name: 'group_name', sortable: true },
  { label: '更新時間', name: 'updated_at' },
  { label: '啟用狀態', name: 'enable_state', elementName: 'slot', width: 95 },
  { label: '操作', name: 'operator', elementName: 'slot', width: 320 }
])
const tableData = ref<any>([])

let pageData = reactive<PageDataType>({
  pageSize: 10,
  pageNo: 1,
  pageTotal: 100
})
const changeSize = (val: number) => {
  pageData.pageSize = val
  pageData.pageNo = 1
  getList()
}
const changePage = (val: number) => {
  pageData.pageNo = val
  getList()
}

const toAdd = () =>{
  console.log(pageData);
  // give me js random number
  const random = Math.floor(Math.random() * 100);
  pageData.pageTotal = random;
  pageData.pageSize = 30;
  pageData.pageNo = 7;
}

</script>
