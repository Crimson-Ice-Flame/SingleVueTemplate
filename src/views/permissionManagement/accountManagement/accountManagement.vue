<template>
  <div>
    <n-row class="top_form_wrapper" :gutter="10" align="bottom" justify="space-between">
      <n-col :span="20">
        <SearchTool
          :searchModel="searchData"
          :searchList="searchList"
          @handleSearchClick="onSearch"
        />
      </n-col>
      <n-col :span="4" class="buttons">
        <n-button type="warning" @click="toAdd">新增 </n-button>
      </n-col>
    </n-row>
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
      <template #enabled="value">
        <!-- <Switch
          v-permission="`${permissionTarget}:EDIT`"
          v-model:enabled="value.row.enabled"
          class="green"
          :id="value.row.id"
          :api="switchApi"
        ></Switch> -->
      </template>
      <template #operator="value">
        <div>
          <n-button class="btn_sure mr_1" @click="toReset(value.row)">密碼重置</n-button>
          <button class="btn_operator text_edit">
            <DeleteIcon />
          </button>
          <button class="btn_operator text_delete">
            <DeleteIcon />
          </button>
        </div>
      </template>
    </ViewTable>
    <PaginationVue :pageData="pageData" @changeSize="changeSize" @changePage="changePage" />
    <n-modal
      v-model:show="showAddDialog"
      title="新增帳號"
      preset="card"
      class="custom_card"
      :style="bodyStyle"
    >
      <n-form ref="formRef" :model="accountFormModel" :rules="accountFormRules">
        <n-form-item path="nickname" label="帳號暱稱">
          <n-input v-model:value="accountFormModel.nickname" type="text" placeholder="" />
        </n-form-item>
        <n-form-item path="account" label="帳號名稱">
          <n-input v-model:value="accountFormModel.account" type="text" placeholder="" />
        </n-form-item>
        <n-form-item path="password" label="權限群組">
          <n-select
            v-model:value="accountFormModel.permission_group_id_list"
            placeholder=""
            multiple
            max-tag-count="responsive"
            :options="permissionOptions"
          />
        </n-form-item>
        <n-form-item path="password" label="設定密碼">
          <n-input
            v-model:value="accountFormModel.password"
            type="password"
            show-password-on="click"
            placeholder=""
            :input-props="{ autocomplete: 'new-password' }"
            :maxlength="24"
          />
        </n-form-item>
        <n-form-item path="reenteredPassword" label="確認密碼">
          <n-input
            v-model:value="accountFormModel.reenteredPassword"
            type="password"
            show-password-on="click"
            placeholder=""
            :maxlength="24"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="center">
          <n-button class="btn_cancel" @click="showAddDialog = false">取消</n-button>
          <n-button class="btn_sure">送出</n-button>
        </n-space>
      </template>
    </n-modal>
    <n-modal
      v-model:show="showResetDialog"
      title="新增帳號"
      preset="card"
      class="custom_card"
      :style="bodyStyle"
    >
      <n-form ref="formRef" :model="resetFormModel" :rules="resetFormRules">
        <n-form-item path="nickname" label="帳號">
          <n-input v-model:value="resetFormModel.account" type="text" disabled />
        </n-form-item>

        <n-form-item path="password" label="設定密碼">
          <n-input
            v-model:value="resetFormModel.password"
            type="password"
            show-password-on="click"
            placeholder=""
            :input-props="{ autocomplete: 'new-password' }"
            :maxlength="24"
          />
        </n-form-item>
        <n-form-item path="changePassword" label="確認密碼">
          <n-input
            v-model:value="resetFormModel.changePassword"
            type="password"
            show-password-on="click"
            placeholder=""
            :maxlength="24"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="center">
          <n-button class="btn_cancel" @click="showResetDialog = false">取消</n-button>
          <n-button class="btn_sure">送出</n-button>
        </n-space>
      </template>
    </n-modal>
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
import DateTime from '@/components/DateTime/DateTime.vue'
import PaginationVue from '@/components/pagination/PaginationTool.vue'

// import IconDialog from '@/components/Dialogs/IconDialog.vue';
// import OrgDialogVue from '@/components/Dialogs/OrgDialog.vue';
// import FormValidVue from '@/components/Form/FormValid.vue';

// Utils
// import type { AddUser, EditUser, ResetPwUser } from '@/type/apis/user';
import type { SearchToolProps } from '@/models/components/searchTool'
import type { TableField } from '@/models/components/viewTable'
import { type PageDataType } from '@/models/components/pagination'

// import { apiGetUserPermissionsGroup } from '@/api/permissions';
import {
  // apiUserAdd,
  apiGetUserList
  // apiUserEnable,
  // apiUserResetVerify,
  // apiUserDelete,
  // apiUserResetPassword,
  // apiUserUpdate,
  // apiUserCheckDelete
} from '@/apis/user'
import { setNull, showNotification } from '@/utils/common'
import type { FormItemRule, FormRules } from 'naive-ui'
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
const searchList = ref<SearchToolProps[]>([
  {
    elementName: 'nInput',
    name: 'group_name',
    label: '權限群組'
  },
  {
    elementName: 'nInput',
    name: 'account',
    placeholder: '請輸入帳號'
  },
  {
    elementName: 'nSelect',
    name: 'enabled',
    label: '啟用狀態',
    selectOptions: twiceOptions,
    option_label: 'label',
    option_value: 'value',
    class: 'form_status'
  }
])
const searchData = ref({
  group_name: null,
  account: null,
  enabled: null
})
const onSearch = (value: any) => {
  pageData.page = 1
  getList()
}

const getList = () => {
  const query = {
    ...searchData.value,
    page_size: pageData.page_size,
    page: pageData.page
  }
  apiGetUserList(query).then((res) => {
    if (res.status === 1) {
      console.log(res)
      tableData.value = res.result.page_data
      pageData.total = res.result.page_info.total
    }
  })
}

const tableList = ref<TableField[]>([
  { label: '帳號', name: 'account', sortable: true },
  { label: '暱稱', name: 'nickname' },
  { label: '權限群組', name: 'group_name', sortable: true },
  { label: '更新時間', name: 'updated_at' },
  { label: '啟用狀態', name: 'enabled', elementName: 'slot', width: 95 },
  { label: '操作', name: 'operator', elementName: 'slot', width: 320 }
])
const tableData = ref<any>([])

let pageData = reactive<PageDataType>({
  page_size: 10,
  page: 1,
  total: 100
})
const changeSize = (val: number) => {
  pageData.page_size = val
  pageData.page = 1
  getList()
}
const changePage = (val: number) => {
  pageData.page = val
  getList()
}

// 新增帳號
const showAddDialog = ref<Boolean>(false)
const bodyStyle = {
  width: '600px'
}
const toAdd = () => {
  showAddDialog.value = true
  accountFormModel.value = setNull(accountFormModel.value)
}
const permissionOptions = ref<any[]>([])
const accountFormModel = ref({
  account: '',
  nickname: '',
  permission_group_id_list: [],
  password: '',
  reenteredPassword: ''
})

function validatePasswordStartWith(rule: any, value: string): boolean {
  console.log(rule)
  let compareModel = rule.field === 'reenteredPassword' ? accountFormModel.value : resetFormModel;

  return (
    !!compareModel.password &&
    compareModel.password.startsWith(value) &&
    compareModel.password.length >= value.length
  )
}
function validatePasswordSame(rule: any, value: string): boolean {
  let compareModel = rule.field === 'reenteredPassword' ? accountFormModel.value : resetFormModel;
  return value === compareModel.password
}

const accountFormRules: FormRules = {
  account: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入帳號'
    }
  ],
  nickname: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入帳號暱稱'
    }
  ],
  password: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入密碼'
    }
  ],
  reenteredPassword: [
    {
      required: true,
      message: '請再輸入密碼',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: '兩次密碼輸入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '兩次密碼輸入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}

// 重製密碼
const showResetDialog = ref<Boolean>(false)
const resetFormModel = reactive({
  id: 0,
  account: '',
  password: '',
  changePassword: ''
})
const resetFormRules: FormRules = {
  password: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入密碼'
    }
  ],
  changePassword: [
    {
      required: true,
      message: '請再輸入密碼',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: '兩次密碼輸入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '兩次密碼輸入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}

const toReset = (rowData: any) => {
  resetFormModel.id = rowData.id
  resetFormModel.account = rowData.account
  console.log(resetFormModel)

  showResetDialog.value = true
}
</script>
