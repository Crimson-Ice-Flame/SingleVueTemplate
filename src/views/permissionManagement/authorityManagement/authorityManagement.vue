<template>
  <div>
    <n-row class="top_form_wrapper" :gutter="10" align="bottom" justify="space-between">
      <n-col :span="20">
        <SearchTool :searchModel="searchData" :searchList="searchList" @handleSearchClick="onSearch" />
      </n-col>
      <n-col :span="4" class="buttons">
        <n-button  type="warning" @click="toAdd">
          新增
        </n-button>
      </n-col>
    </n-row>
    <ViewTable :haveIndexColumn="true" :tableList="tableList" :tableData="tableData" class="blue">
      <template #created_at="value">
        <DateTime :timestamp="value.row.created_at"></DateTime>
      </template>
      <template #update_at="value">
        <DateTime :timestamp="value.row.updated_at"></DateTime>
      </template>
      <template #group_name="value">
        <a class="text_link" @click="toView(value.row.org_group_id)">{{ value.row.group_name }}</a>
      </template>
      <template #status="value">
        <n-switch v-model:value="value.row.enabled" @update:value="handleSwitchChange($event, value.row.org_group_id)" />
      </template>
      <template #operator="value">
        <button class="btn_operator text_edit" @click="toEdit(value.row.org_group_id)">
          <span class="icon-6"></span>
        </button>
        <n-popconfirm
        v-if="value.row.use_count === 0"
          positive-text="確認刪除"
          negative-text="取消"
          @positive-click="toDelete(value.row.org_group_id)"
        >
          <template #trigger>
            <button
             class="btn_operator text_delete">
              <i class="icon-33"></i>
            </button>
          </template>
          請問是否刪除此{{ value.row.account }}權限？
        </n-popconfirm>
        <!-- <button
          v-permission="`${permissionTarget}:EDIT`"
          class="btn_operator text_edit"
          @click="toEdit(value.row.org_group_id)"
        >
          <i class="icon icon-6"></i>
        </button>
        <button
          v-if="value.row.use_count === 0"
          v-permission="`${permissionTarget}:DELETE`"
          class="btn_operator text_delete"
          @click="toDelete(value.row.org_group_id)"
        >
          <i class="icon icon-33"></i>
        </button> -->
      </template>
    </ViewTable>
    <PaginationVue
      :pageData="pageData"
      @changeSize="changeSize"
      @changePage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import ViewTable from '@/components/tables/ViewTable.vue'
import SearchTool from '@/components/search/SearchTool.vue'
import DateTime from '@/components/DateTime/DateTime.vue'
import PaginationVue from '@/components/pagination/PaginationTool.vue'

import type { SearchToolProps } from '@/models/components/searchTool';
import type { TableField } from '@/models/components/viewTable';
// Utils

import { showNotification,EnableOptions, type SelectOption } from '@/utils/common';
import type { PageDataType } from '@/models/components/pagination';
import type { PermissionSearchParams } from '@/models/api/permissions';
import { apiEnablePermission, apiGetPermissionList,apiDeletePermission, permissionGroupOptions } from '@/apis/permission';
// import { getPermissionID } from '@/utils/permission';

const permissionTarget: string = 'Authority_Management';

const permissionOptions = ref<SelectOption[]>([])

const router = useRouter();

///////search
const groups = ref([]);
const searchRef = ref<any>();
const searchList = ref<SearchToolProps[]>([
  {
    elementName: 'nSelect',
    name: 'group_name',
    label: '權限群組',
    selectOptions: permissionOptions,
    option_label: 'label',
    option_value: 'value'
  },
  {
    elementName: 'nSelect',
    name: 'enabled',
    label: '啟用狀態',
    selectOptions: EnableOptions,
    option_label: 'label',
    option_value: 'value',
    class: 'form_status'
  }
]);
const searchData = ref<PermissionSearchParams>({
  group_name: null,
  enabled: null
});
const onSearch = () => {
  pageData.page = 1;
  getPermissionList();
};
///////search

///////table
const tableList = ref<TableField[]>([
  { label: '建立時間', name: 'created_at', elementName: 'slot' },
  { label: '群組名稱', name: 'group_name', width: 250, elementName: 'slot' },
  { label: '使用數量', name: 'use_count', width: 100 },
  { label: '更新時間', name: 'update_at', elementName: 'slot' },
  { label: '啟用狀態', name: 'status', elementName: 'slot', width: 95 },
  { label: '操作', name: 'operator', elementName: 'slot', width: 100 }
]);
const tableData = ref<any>([]);
///////table

///////pagination
let pageData = reactive<PageDataType>({
  page_size: 10,
  page: 1,
  total: 0
})
const changeSize = (val: number) => {
  console.log('val', val);
  pageData.page_size = val;
  pageData.page = 1;
  getPermissionList();
};
const changePage = (val: number) => {
  pageData.page = val;
  getPermissionList();
};
///////pagination

const toAdd = () => {
  router.push({ path: `/permission/management/add` });
};
const toView = (id: string) => {
  router.push({ path: `/permission/management/view/${id}` });
};
const toEdit = (id: string) => {
  router.push({ path: `/permission/management/edit/${id}` });
};

const handleSwitchChange = (value: boolean, id: number) =>{
  apiEnablePermission(id).then((res) => {
    if (res.status === 1) {
      const switchMessage = value ? '啟用成功' : '停用成功';
      showNotification('success', switchMessage, 'success')
    }
  })
}
const toDelete = (id: number) => {
  apiDeletePermission(id).then((res) => {
    if (res.status === 1) {
      getPermissionList();
      showNotification('success', '刪除成功', 'success')
    }
  });
};

///////function&api
const getPermissionList = () => {
  const query: PermissionSearchParams = {
    ...searchData.value,
    page: pageData.page,
    page_size: pageData.page_size
  };
  apiGetPermissionList(query).then(res => {
    if (res.status === 1) {
      tableData.value = res.result.page_data;
      pageData.page = res.result.page_info.current_page;
      pageData.page_size = res.result.page_info.page_size;
      pageData.total = res.result.page_info.total;
    }
  });
};


onMounted(async() => {
  getPermissionList();
  permissionOptions.value = await permissionGroupOptions();

});
</script>
