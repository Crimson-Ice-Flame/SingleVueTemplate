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
        <n-switch v-model:value="value.row.enabled" @update:value="handleSwitchChange($event, value.row.id)" />
      </template>
      <template #operator="value">
        <n-button class="btn_sure mr_1" @click="showResetForm(value.row)">密碼重置</n-button>
        <button class="btn_operator text_edit" @click="toEdit(value.row.id)">
          <span class="icon-6"></span>
        </button>
        <n-popconfirm
          positive-text="確認刪除"
          negative-text="取消"
          @positive-click="handlePositiveClick(value.row.id)"
        >
          <template #trigger>
            <button class="btn_operator text_delete">
              <i class="icon-33"></i>
            </button>
          </template>
          請問是否刪除此{{ value.row.account }}帳號？
        </n-popconfirm>
      </template>
    </ViewTable>
    <PaginationVue :pageData="pageData" @changeSize="changeSize" @changePage="changePage" />
    <n-modal
      v-model:show="showAccountFormDialog"
      :title="accountFormDialogTitle"
      preset="card"
      class="custom_card"
      :style="bodyStyle"
    >
      <n-form ref="accountFormRef" :model="accountFormModel" :rules="accountFormRules">
        <n-form-item path="account" label="設定帳號">
          <n-input v-model:value="accountFormModel.account" type="text" placeholder="" :disabled="accountFormDialogTitle === '編輯帳號'" />
        </n-form-item>
        <n-form-item path="nickname" label="帳號暱稱">
          <n-input v-model:value="accountFormModel.nickname" type="text" placeholder="" />
        </n-form-item>
        <n-form-item path="permission_group_id_list" label="權限群組">
          <n-select
            v-model:value="accountFormModel.permission_group_id_list"
            placeholder=""
            multiple
            max-tag-count="responsive"
            clearable
            :options="permissionOptions"
          />
        </n-form-item>
        <template v-if="isAccountFormAdd">
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
      </template>
      </n-form>
      <template #footer>
        <n-space justify="center">
          <n-button class="btn_cancel" @click="showAccountFormDialog = false">取消</n-button>
          <n-button class="btn_sure" v-show="isAccountFormAdd" @click="toCreateAccount">送出</n-button>
          <n-button class="btn_sure" v-show="!isAccountFormAdd" @click="toEditAccount">送出</n-button>
        </n-space>
      </template>
    </n-modal>
    <n-modal
      v-model:show="showResetDialog"
      title="重置密碼"
      preset="card"
      class="custom_card"
      :style="bodyStyle"
    >
      <n-form ref="resetFormRef" :model="resetFormModel" :rules="resetFormRules">
        <n-form-item path="account" label="帳號">
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
          <n-button class="btn_sure" @click="toResetPw">送出</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import ViewTable from '@/components/tables/ViewTable.vue'
import SearchTool from '@/components/search/SearchTool.vue'
import DateTime from '@/components/DateTime/DateTime.vue'
import PaginationVue from '@/components/pagination/PaginationTool.vue'

// Utils
import { setNull, showNotification } from '@/utils/common'

// Apis
import {
  apiGetUserList,
  apiAddUserAccount,
  apiUpdateUserAccount ,
  apiDeleteUserAccount,
  apiResetUserAccount,
  apiGetUserAccount,
  apiEnableUserAccount
} from '@/apis/user'

// Types
import type {  FormInst, FormRules, FormValidationError } from 'naive-ui'
import type { SearchToolProps } from '@/models/components/searchTool'
import type { TableField } from '@/models/components/viewTable'
import { type PageDataType } from '@/models/components/pagination'
import type { UserCreateModel, UserCreateReq, UserListReq, UserResetPwModel, UserResetPwReq, UserUpdateReq } from '@/models/api/user'

// import { getPermissionID } from '@/utils/permission';

const permissionTarget = 'Account_Management'
const route = useRoute()
const router = useRouter()
const twiceOptions: any = [
  { label: '啟用', value: 1 },
  { label: '停用', value: 0 }
]
const searchList = ref<SearchToolProps[]>([
  {
    elementName: 'nInput',
    name: 'group_id',
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
const searchData = ref<UserListReq>({
  group_id: null,
  account: null,
  enabled: null
})
const onSearch = (value: any) => {
  pageData.page = 1
  getList()
}

const getList = () => {
  const query: UserListReq = {
    ...searchData.value,
    page_size: pageData.page_size,
    page: pageData.page
  }
  apiGetUserList(query).then((res) => {
    if (res.status === 1) {
      tableData.value = res.result.page_data
      pageData.total = res.result.page_info.total
    }
  })
}

const tableList = ref<TableField[]>([
  { label: '帳號', name: 'account', sortable: true },
  { label: '暱稱', name: 'nickname' },
  { label: '權限群組', name: 'group_name', sortable: true },
  { label: '更新時間', name: 'updated_at', elementName: 'slot' },
  { label: '啟用狀態', name: 'enabled', elementName: 'slot', width: 95 },
  { label: '操作', name: 'operator', elementName: 'slot', width: 320 }
])
const tableData = ref<any>([])

let pageData = reactive<PageDataType>({
  page_size: 10,
  page: 1,
  total: 10
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
const showAccountFormDialog = ref<Boolean>(false)
const accountFormRef = ref<FormInst | null>(null)
const bodyStyle = {
  width: '450px'
}

const accountFormDialogTitle = computed(() => {
  return isAccountFormAdd.value ? '新增帳號' : '編輯帳號'
})
const isAccountFormAdd = ref<Boolean>(true);
const toAdd = () => {
  isAccountFormAdd.value = true;
  showAccountFormDialog.value = true
  accountFormModel.value = setNull(accountFormModel.value)
}
const permissionOptions = ref([
  {
    value: 1,
    label: 'MasterGroup'
  }
])
const accountFormModel = ref<UserCreateModel>({
  account: '',
  nickname: '',
  permission_group_id_list: null
})

function isPasswordValid(rule: any, value: string): boolean {
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegExp.test(value) && value.length >= 8 && value.length <= 16;
}

function validatePasswordStartWith(rule: any, value: string): boolean {
  let compareModel = rule.field === 'reenteredPassword' ? accountFormModel.value : resetFormModel

  return (
    !!compareModel.password &&
    compareModel.password.startsWith(value) &&
    compareModel.password.length >= value.length
  )
}
function validatePasswordSame(rule: any, value: string): boolean {
  let compareModel = rule.field === 'reenteredPassword' ? accountFormModel.value : resetFormModel
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
  permission_group_id_list: [
    {
      type: 'array',
      required: true,
      trigger: ['blur', 'change'],
      message: '請選擇權限群組'
    }
  ],
  password: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入密碼'
    },
    {
      validator: isPasswordValid,
      message: '需英數字混合，且要大小寫各一個，至少8-16個字元',
      trigger: 'input'
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
      message: '兩次密碼長度輸入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '兩次密碼輸入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}

const toEdit = async (id: number) => {
  isAccountFormAdd.value = false;
  const rep = await apiGetUserAccount(id)
  if (rep.status === 1) {
    accountFormModel.value.id = rep.result.id;
    accountFormModel.value.account = rep.result.account;
    accountFormModel.value.nickname = rep.result.nickname;
    accountFormModel.value.permission_group_id_list = rep.result.permission_group_id_list;
    showAccountFormDialog.value = true
  }
}

const toCreateAccount = () => {
  accountFormRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      const query: UserCreateReq = {
        account: accountFormModel.value.account,
        nickname: accountFormModel.value.nickname,
        password: accountFormModel.value.password!,
        permission_group_id_list: accountFormModel.value.permission_group_id_list!
      }
      apiAddUserAccount(query).then((res) => {
        if (res.status === 1) {
          showAccountFormDialog.value = false
          getList()
          showNotification('success', '新增成功', 'success')
        }
      })
    }
  })
}

const toEditAccount = () => {
  accountFormRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      const query :UserUpdateReq= {
        id: accountFormModel.value.id,
        auth_group: accountFormModel.value.permission_group_id_list!
      }
      apiUpdateUserAccount(query).then((res) => {
        if (res.status === 1) {
          showAccountFormDialog.value = false
          getList()
          showNotification('success', '更新成功', 'success')
        }
      })
    }
  })
}

const handlePositiveClick = (id: number) => {
  apiDeleteUserAccount(id).then((res) => {
    if (res.status === 1) {
      getList()
      showNotification('success', '刪除成功', 'success')
    }
  })
}

// 重製密碼
const showResetDialog = ref<Boolean>(false)
const resetFormRef = ref<FormInst | null>(null)
const resetFormModel = reactive<UserResetPwModel>({
  id: null,
  account: null,
  password: null,
  changePassword: null
})
const resetFormRules: FormRules = {
  password: [
    {
      required: true,
      trigger: ['input'],
      message: '請輸入密碼'
    },
    {
      validator: isPasswordValid,
      message: '需英數字混合，且要大小寫各一個，至少8-16個字元',
      trigger: 'input'
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
      message: '兩次密碼長度輸入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '兩次密碼輸入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}

const handleSwitchChange = (value: boolean, id: number) =>{
  apiEnableUserAccount(id).then((res) => {
    if (res.status === 1) {
      const switchMessage = value ? '啟用成功' : '停用成功';
      showNotification('success', switchMessage, 'success')
    }
  })
}

const showResetForm = (rowData: any) => {
  resetFormModel.id = rowData.id
  resetFormModel.account = rowData.account
  resetFormModel.password = null
  resetFormModel.changePassword = null
  showResetDialog.value = true
}

const toResetPw = () => {
  resetFormRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
  const query: UserResetPwReq = {
    id: resetFormModel.id!,
    password: resetFormModel.password!
  }
  apiResetUserAccount(query).then((res) => {
    if (res.status === 1) {
      showNotification('success', '重置成功', 'success')
    }
  })

}
  })
}

onMounted(() => {
  getList()
})
</script>
