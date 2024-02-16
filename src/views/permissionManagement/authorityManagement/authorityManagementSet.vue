<template>
  <div>
    <div class="board">
      <div class="board_inner">
        <el-row class="board_head">
          <el-col :span="12">
            <h2 class="board_title">{{ headTitle }}</h2>
          </el-col>
          <el-col class="buttons" :span="12">
            <el-button class="btn_cancel" @click="cancel()">取消</el-button>
            <el-button
              v-if="!isView"
              class="btn_sure"
              type="primary"
              @click="submitForm()"
            >
              儲存
            </el-button>
          </el-col>
        </el-row>
        <el-form
          ref="ruleFormRef"
          :model="orgGroupForm"
          :rules="rules"
          :inline="true"
          label-position="left"
          label-width="auto"
          class="top_form"
        >
          <el-form-item label="群組名稱" prop="groupName">
            <el-input
              v-model="orgGroupForm.groupName"
              :disabled="isView"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-button
            v-if="pageType !== 'view'"
            class="btn_allowAll"
            @click="checkPermission('all')"
          >
          允許全部權限
          </el-button>
        </el-form>
        <div class="tree_container">
          <div class="tree_head">
            <div class="tree_node">
              <div class="tree_node__label">功能</div>
              <div class="tree_node__controls">
                <div class="tree_node__check">全選</div>
                <div class="tree_node__check">
                  <el-checkbox
                    v-model="checkAdd"
                    label="新增"
                    size="large"
                    :disabled="isView"
                  />
                </div>
                <div class="tree_node__check">
                  <el-checkbox
                    v-model="checkDelete"
                    label="刪除"
                    size="large"
                    :disabled="isView"
                  />
                </div>
                <div class="tree_node__check">
                  <el-checkbox
                    v-model="checkEdit"
                    label="編輯"
                    size="large"
                    :disabled="isView"
                  />
                </div>
                <div class="tree_node__check">
                  <el-checkbox
                    v-model="checkView"
                    label="檢視"
                    size="large"
                    :disabled="isView"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="tree_body">
              <el-tree
                :data="permissionsMap"
                node-key="menu_id"
                :props="defaultProps"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :indent="0"
              >
                <template #default="{ node, data }">
                  <div class="tree_node">
                    <div class="tree_node__label" @click="nodeLabelClick(node)">
                      <span class="title">{{ permissionGroupMap.get(node.label) }}</span>
                      <span
                        v-if="data.sub_menu_list && data.sub_menu_list.length > 0"
                        class="arrow icon-26"
                        :class="{ expanded: node.expanded }"
                      >
                    </span>
                    </div>
                    <div class="tree_node__controls">
                      <div class="tree_node__check">
                        <el-checkbox
                          v-model="data.checked_all"
                          size="large"
                          :disabled="isView || checkAllDisabled(data.target, data.permissions)"
                          @change="menuCheckedAll(data)"
                        />
                      </div>
                      <div class="tree_node__check">
                        <el-checkbox
                        v-if="isShowCheckBox(data,'PermissionAccessType_Add')"
                          v-model="findBindPermissionModel(data,'PermissionAccessType_Add').checked"
                          size="large"
                          :disabled="isView || checkPartDisabled(data.target, 'PermissionAccessType_Add')"
                          @change="menuCheckedPart(data, 'PermissionAccessType_Add')"
                        />
                      </div>
                      <div class="tree_node__check">
                        <el-checkbox
                        v-if="isShowCheckBox(data,'PermissionAccessType_Delete')"
                          v-model="findBindPermissionModel(data,'PermissionAccessType_Delete').checked"
                          size="large"
                          :disabled="isView || checkPartDisabled(data.target, 'PermissionAccessType_Delete')"
                          @change="menuCheckedPart(data, 'PermissionAccessType_Delete')"
                        />
                      </div>
                      <div class="tree_node__check">
                        <el-checkbox
                        v-if="isShowCheckBox(data,'PermissionAccessType_Edit')"
                          v-model="findBindPermissionModel(data,'PermissionAccessType_Edit').checked"
                          size="large"
                          :disabled="isView || checkPartDisabled(data.target, 'PermissionAccessType_Edit')"
                          @change="menuCheckedPart(data, 'PermissionAccessType_Edit')"
                        />
                      </div>
                      <div class="tree_node__check">
                        <el-checkbox
                          v-if="isShowCheckBox(data,'PermissionAccessType_View')"
                          v-model="findBindPermissionModel(data,'PermissionAccessType_View').checked"
                          size="large"
                          :disabled="isView || checkPartDisabled(data.target, 'PermissionAccessType_View')"
                          @change="menuCheckedPart(data, 'PermissionAccessType_View')"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </el-tree>
          </div>
        </div> 
      </div>
    </div>
    <!-- <IconDialogVue
      ref="cancelConfirmDialog"
      class="orange_icon"
      :dialog-model="dialogOptions"
      @handle-submit="dialogSubmit()"
    /> -->
  </div>
</template>

<script lang="ts" setup name="authorityManagementSet">
// import { ref, reactive, computed, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue';
// import { useStore } from '@/store';
// import { useRoute } from 'vue-router';
// import { useI18n } from 'vue-i18n';

// Plugins
import _ from 'lodash';

// Api
import {
  apiGetPermissionsMap,
  apiGetPermissions,
  apiPostPermissionsAdd,
  apiPostPermissionsEdit
} from '@/apis/permission';

// Utils
import { showNotification, isEqual } from '@/utils/common';
import { pageTypePermissionCheck } from '@/utils/permission';
import {
  alwaysCheck,
  checkWithView
} from '@/views/permissionManagement/authorityManagement/permissionCheckDisabled';

// components
import {ElScrollbar, ElTree, ElCheckbox, ElForm} from 'element-plus'

// types
import type { FormInstance, FormRules } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import type { PermissionsSet, PermissionsEdit } from '@/models/api/permissions';


const permissionTarget = 'Authority_Management';


// // 取得路徑與利用路徑資料做設定
const route = useRoute();
const router = useRouter();
const pageType: string | string[] = route.params.pageType;
const orgGroupId: number = Number(route.params.id);

// pageTypePermissionCheck(permissionTarget, pageType);

const permissionGroupMap = new Map([
  ["Page_Home", "首頁"],
  ["Page_Permission_Management", "權限管理"],
  ["Page_Account_Management", "帳號管理"],
  ['Page_Permission_Group_Management', '權限群組管理'],
  ['Page_Navigate_Web_Management', '導航網管理'],
  ['Page_Navigate_Web_Report', '數據報表']
]);


function isShowCheckBox(data: any, access_type: string) {
  return data.permissions.some((item: { access_type: string }) => item.access_type === access_type);
};
function findBindPermissionModel(data: any, access_type: string) {
  return data.permissions.find((item: { access_type: string }) => item.access_type === access_type);
};

const isView: boolean = pageType === 'view';

// 上方 Title 顯示的文字
const headTitle = computed(() => {
  const title = '權限群組';
  switch (pageType) {
    case 'add': {
      return '新增'+title;
    }
    case 'edit': {
      return '編輯'+title;
    }
    case 'view': {
      return '檢視'+title;
    }
    default: {
      return '新增'+title;
    }
  }
});

// 上方 Form 的 Data
const ruleFormRef = ref<FormInstance>();
const orgGroupForm = reactive({
  groupName: ''
});
const copyOrgGroupForm = ref<any>(_.cloneDeep(orgGroupForm));
const rules = reactive<FormRules>({
  groupName: [
    { required: true, message: '請輸入權限群組', trigger: 'blur' },
    { max: 10, message: 'Length should be 10', trigger: 'blur' }
  ]
});

// 樹狀列表body高度
const treeBodyHeight = ref<number>(500);
const treeBodyHeightSet = () => {
  const getElementHeight = (selector: string) => {
    const element = document.querySelector(selector);
    return element ? parseInt(window.getComputedStyle(element).height, 10) : 0;
  };

  const mainHeight = getElementHeight('.app_main');
  const boardHeadHeight = getElementHeight('.board_head');
  const topFormHeadHeight = getElementHeight('.top_form');
  const treeHeadHeadHeight = getElementHeight('.tree_head');

  const resultHeight =
    mainHeight - boardHeadHeight - topFormHeadHeight - treeHeadHeadHeight - 24 * 5 - 5;
  treeBodyHeight.value = resultHeight < 500 ? 500 : resultHeight;
};

// 樹狀列表的Props / 資料
const defaultProps = reactive({
  label: 'name',
  children: 'sub_menu_list'
});
const permissionsMap = ref<any>([]);

// 群組擁有的權限 - get: 取得被打勾的權限 / set: 編輯要打勾的權限
const menuPermissionsData = computed({
  get: () => {
    const result: any = [];
    const catchPermission = (array: any) => {
      array.forEach((el: any) => {
        if (el.sub_menu_list) {
          catchPermission(el.sub_menu_list);
        }
        el.permissions.forEach((item: { checked: boolean; menu_permission_id: number; }) => {
          if (item.checked === true) {
            result.push(item.menu_permission_id);
          }
        });
      });
    };
    catchPermission(permissionsMap.value);
    return result;
  },
  set: val => {
    const permissionIds: number[] = val.map((item: any) => item.menu_permission_id);
    checkPermission(permissionIds);
  }
});

// 權限功能列 新增/刪除/編輯/查看/覆核 - get: 取得功能的 boolean / set: 編輯要打勾的權限
const checkAdd = computed({
  get: () => {
    return catchPartAll('PermissionAccessType_Add');
  },
  set: val => {
    checkPermission('PermissionAccessType_Add', val);
  }
});
const checkDelete = computed({
  get: () => {
    return catchPartAll('PermissionAccessType_Delete');
  },
  set: val => {
    checkPermission('PermissionAccessType_Delete', val);
  }
});
const checkEdit = computed({
  get: () => {
    return catchPartAll('PermissionAccessType_Edit');
  },
  set: val => {
    checkPermission('PermissionAccessType_Edit', val);
  }
});
const checkView = computed({
  get: () => {
    return catchPartAll('PermissionAccessType_View');
  },
  set: val => {
    checkPermission('PermissionAccessType_View', val);
  }
});

// 設定權限項目的 boolean
const checkPermission = (part: number[] | string, checked: boolean = true) => {
  const runCheck = (array: any) => {
    array.forEach((el: any) => {
      if (typeof part === 'object' || part === 'all') {
        el.permissions.forEach((item: { menu_permission_id: number; checked: boolean; }) => {
          if (typeof part === 'object') {
            if (part.includes(item.menu_permission_id)) {
              item.checked = checked;
            }
          } else if (part === 'all') {
            item.checked = checked;
          }
        });
      } else {
        const permissionItem = findBindPermissionModel(el, part);
        if (permissionItem && !alwaysCheck[permissionItem.target]?.includes(part)) {
          permissionItem.checked = checked;

          // 檢視的連動勾選
          viewCheckedLinkage(el, part);
        }
      }

      if (el.sub_menu_list) {
        runCheck(el.sub_menu_list);
      }

      // 設定項目中的全選
      const menuPermissionsChecked = el.permissions.map((item: { checked: any; }) => item.checked);
      el.checked_all = !menuPermissionsChecked.includes(false);
    });
  };
  runCheck(permissionsMap.value);
};

// 取得權限功能列 新增/刪除/編輯/查看 boolean
const catchPartAll = (part: string): boolean => {
  let result: boolean = true;
  const runCheck = (array: any) => {
    for (let el of array) {
      const permissionItem = findBindPermissionModel(el, part);
      if (permissionItem && !permissionItem.checked) {
        result = false;
        break;
      }
      if (el.sub_menu_list) {
        runCheck(el.sub_menu_list);
        if (!result) break;
      }
    }
  };
  runCheck(permissionsMap.value);
  return result;
};

// menu 權限的全選設定
const menuCheckedAll = (data: any) => {
  const checked: boolean = data.checked_all;
  Object.keys(data.permissions).forEach(key => {
    data.permissions[key].checked = checked;
  });
};
// menu 權限各功能的 change 事件
const menuCheckedPart = (data: any, part: 'PermissionAccessType_Add' | 'PermissionAccessType_Delete' | 'PermissionAccessType_Edit' | 'PermissionAccessType_View') => {
  // 檢視的連動勾選
  viewCheckedLinkage(data, part);

  // 設定項目中的全選
  const menuPermissionsChecked = Object.values(data.permissions).map((item: any) => item.checked);
  data.checked_all = !menuPermissionsChecked.includes(false);
};

// 檢視的連動勾選
const viewCheckedLinkage = (data: any, part: any) => {
  let permissionItemPart = findBindPermissionModel(data, part);
  let permissionItemView = findBindPermissionModel(data, 'PermissionAccessType_View');
  // - 新增/刪除/編輯/覆核 勾選設定時
  if (part !== 'PermissionAccessType_View') {
    // - 新增/刪除/編輯/覆核 被勾選，且檢視未勾選時，檢視要被勾選
    
    if (permissionItemPart.checked && !permissionItemView.checked) {
      permissionItemView.checked = true;
    }

    // - 新增/刪除/編輯 取消勾選，且需與檢視綁定時，連同檢視也要取消勾選
    if (
      !permissionItemPart.checked &&
      checkWithView.includes(data.target)
    ) {
      permissionItemView.checked = false;
    }

    // 與檢視綁定的權限項目，針對VIEW的部分再進行一次連動檢查
    if (checkWithView.includes(data.target)) {
      viewCheckedLinkage(data, 'PermissionAccessType_View');
    }
  }

  // - 檢視勾選設定時
  if (part === 'PermissionAccessType_View') {
    // 檢視被勾選，且其他功能(排除覆核)綁定檢視的時，將其他功能(排除覆核)一同勾選
    if (permissionItemPart.checked && checkWithView.includes(data.target)) {
      data.permissions.forEach((item: { access_type: string; checked: boolean; }) => {
        if (item.access_type !== 'PermissionAccessType_View') {
          item.checked = true;
        }
      });
    }

    // - 檢視取消勾選時，一併將 新增/刪除/編輯/覆核 的勾選取消
    if (!permissionItemPart.checked) {
      data.permissions.forEach((item: { access_type: string; checked: boolean; }) => {
        if (item.access_type !== 'PermissionAccessType_View') {
          item.checked = false;
        }
      });
    }
  }
};

// checkBox disabled 設定
// - 權限的 全選checkBox disabled判斷
const checkAllDisabled = (target: string, permissions: any): boolean => {
  // 判斷絕對要勾選的 target 的 key 值在項目的 permission 中是否都找的到
  if (alwaysCheck[target]) {
    const set1 = new Set(Object.keys(permissions));

    for (const value of alwaysCheck[target]) {
      if (!set1.has(value)) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
};
// - 權限的 功能checkBox disabled判斷
const checkPartDisabled = (
  target: string,
  part: 'PermissionAccessType_Add' | 'PermissionAccessType_Delete' | 'PermissionAccessType_Edit' | 'PermissionAccessType_View'
): boolean => {
  let result: boolean = false;

  if (alwaysCheck[target] && alwaysCheck[target].includes(part)) {
    result = true;
  }

  if (checkWithView.includes(target) && part !== 'PermissionAccessType_View') {
    result = true;
  }

  return result;
};

// 節點上 label 的點擊事件，用於控制節點的收合
const nodeLabelClick = (node: Node) => {
  node.expanded = !node.expanded;
};

// 送出儲存
const submitForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(valid => {
    if (valid) {
      const submitData = {
        name: orgGroupForm.groupName,
        menu_permissions_data: menuPermissionsData.value
      };
      if (pageType === 'add') {
        const submitAddData: PermissionsSet = {
          ...submitData
        };
        apiPostPermissionsAdd(submitAddData).then(res => {
          submitNotification(res.status);
          if (res.status === 1) goBack();
        });
      } else if (pageType === 'edit') {
        const submitEddData: PermissionsEdit = {
          org_group_id: orgGroupId,
          ...submitData
        };
        apiPostPermissionsEdit(submitEddData).then(res => {
          submitNotification(res.status);
        });
      }
    } else {
      // store.dispatch('app/CHANGE_LOADING', { isOpen: false });
    }
  });
};
// 送出儲存成功與否的提示
const submitNotification = (status: number) => {
  if (status === 1) {
    showNotification('通知', '儲存成功', 'success', 'bottom-right');
  }
};

// 回權限列表
const goBack = () => {
  // store.dispatch('breadcrumbReload/GO_BACK', 'authority_management');
  router.push({ name: 'authority' });
};

// 取消按鈕事件
const cancel = () => {
  goBack();
};
// 取消彈窗的資料設定
const cancelConfirmDialog = ref<any>(null);
// const dialogOptions: DialogType = {
//   dialogVisible: false,
//   contentNotice: t('Confirm_Action', { title: t('Cancel') }),
//   cancelBtnText: t('Cancel'),
//   confirmBtnText: t('Confirm')
// };
// 取消彈窗的動作處理
const openDialog = () => {
  cancelConfirmDialog.value.open();
};
const dialogSubmit = async () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }

  goBack();
};

// 取得權限設定
const getList = async () => {
  // 取得權限地圖
  await apiGetPermissionsMap().then(res => {
    if (res.result) {
      // 為了樹狀列表中 checkBox 的顯示，加工後端來的資料，對每個控制向加入 checked (key)，預設 false (value)
      const testMap = res.result;
      const addChecked = (array: any) => {
        array.forEach((el: any) => {
          if (el.sub_menu_list) {
            addChecked(el.sub_menu_list);
          }
          el['checked_all'] = false;
          el.permissions.forEach((item: { checked: boolean; }) => {
            item.checked = false;
          });
        });
      };
      addChecked(testMap);
      permissionsMap.value = testMap;
    }
  });
  console.log(permissionsMap.value);
  // 在新增的時候要先將總是勾選的權限打勾
  if (pageType === 'add') {
    const menuPermissionsIds: any[] = [];

    const extractIds = (menu: any) => {
      // 判斷項目的權限是否在永遠勾選的資料裡
      if (alwaysCheck[menu.target]) {
        menu.permissions.forEach((item: any) => {
          if (alwaysCheck[menu.target].includes(item.access_type)) {
            menuPermissionsIds.push(
              item.menu_permission_id
            );
          }
        });
      }
      if (menu.sub_menu_list?.length > 0) {
        menu.sub_menu_list.forEach((subMenu: any) => {
          extractIds(subMenu);
        });
      }
    };

    permissionsMap.value.forEach((menu: any) => {
      extractIds(menu);
    });

    menuPermissionsData.value = menuPermissionsIds;
  }
  // 在編輯或檢視時取得權限群組的資料
  else {
    await apiGetPermissions(orgGroupId).then(res => {
      if (res.result) {
        orgGroupForm.groupName = res.result.name;
        menuPermissionsData.value = res.result.menu_permission_data_list;
      }
    });
  }
};

// resize
function resizeHandler(e: Event): void {
  treeBodyHeightSet();
}

// Hooks
onActivated(async () => {
  getList();
  treeBodyHeightSet();
  window.addEventListener('resize', resizeHandler);
});


onUnmounted(() => {
  console.log(permissionsMap.value);

  window.removeEventListener('resize', resizeHandler);
});


const countFlag = ref<number>(0);
</script>

<style scoped lang="scss">
@import '@/assets/scss/pages/authority_management_set.scss';

:deep {
  .el-tree {
    &-node {
      white-space: normal;
      &__content {
        height: auto;
        display: block;
        &:hover {
          background-color: darken(#f5f7fa, 5%);
        }
      }
      &__label {
        flex: 1 1 auto;
      }
      .el-icon {
        display: none;
      }
    }
    > .el-tree-node {
      > .el-tree-node__children {
        background-color: #f8f8f8;
        > .el-tree-node {
          > .el-tree-node__children {
            background-color: #f2f7ff;
            > .el-tree-node {
              > .el-tree-node__children {
                background-color: darken(#f2f7ff, 3%);
                > .el-tree-node {
                  > .el-tree-node__children {
                    background-color: darken(#f2f7ff, 6%);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .el-checkbox.el-checkbox--large {
    height: auto;
  }
}
.tree_head {
  .tree_node__check {
    :deep {
      .el-checkbox {
        white-space: normal;
        &__label {
          color:#ffff !important;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
