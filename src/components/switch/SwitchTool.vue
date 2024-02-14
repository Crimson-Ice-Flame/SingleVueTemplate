<template>
  <div>
    <div class="switch_wrapper">
      <a
        :class="['self_switch', { is_active: props.enabled, 'is-disabled': props.isDisabled }]"
        @click="selfSwitchStatus"
      >
        <i></i>
      </a>
    </div>
    <el-dialog
      class="company_list_dialog"
      v-model="dialogVisible"
      :title="title"
      :width="width"
      align-center
      :append-to-body="true"
    >
      <el-row justify="center">確定要刪除嗎?</el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-row justify="center">
            <el-button @click="dialogVisible = false" class="btn_cancel">取消</el-button>
            <el-button @click="switchAction" class="btn_sure">刪除</el-button>
          </el-row>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElNotification } from 'element-plus';
// import { useI18n } from 'vue-i18n';

const emits = defineEmits(['update:enabled', 'onChangeEnabled']);
const props = defineProps<{
  api: any; // list
  enabled: boolean;
  id?: number;
  isDisabled?: boolean;
  dialogTitle?: string;
  beforeSwitchAction?: () => Promise<boolean>; // 在切換開關之前的動作是否要執行開關
}>();

// const { t } = useI18n();

const enabled = computed({
  get: () => props.enabled,
  set: (val: boolean) => {
    emits('update:enabled', val);
    emits('onChangeEnabled', val);
  }
});

const title = computed(() => {
  return props.dialogTitle || '停用';
});

//打開對話框
const dialogVisible = ref<boolean>(false);
const width = ref<string | null>(null);
const switchAction = async () => {
  const api = props.api;
  const query = {
    id: props.id,
    enabled: !props.enabled
  };
  const res = await api(query);
  if (res.status === 1) {
    ElNotification({
      message: 'Success',
      type: 'success',
      position: 'bottom-right'
    });
    enabled.value = !enabled.value;
    dialogVisible.value = false;
    return true;
  } else {
    return false;
  }
};
const selfSwitchStatus = async () => {
  width.value = '300px';
  if (props.id) {
    if (props.beforeSwitchAction && (await props.beforeSwitchAction())) return;
    if (props.enabled) {
      dialogVisible.value = true;
    } else {
      // 狀態為false 直接呼叫api然後啟用
      switchAction();
    }
  }
};
</script>

<style scoped lang="scss">
.switch_wrapper {
  line-height: 0;
}
.self_switch {
  border: 2px solid #dcdfe6;
  background-color: #dcdfe6;
  width: 40px;
  height: 19px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  min-width: 42px;
  outline: 0;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: #dcdfe6;
  position: relative;
  i {
    position: absolute;
    left: 0px;
    width: 17px;
    height: 17px;
    background-color: #ffff;
    border-radius: 50%;
    z-index: 9;
  }
  &:hover,
  &:focus {
    border-color: #bdbaba;
    background-color: #bdbaba;
  }
  &.is-disabled {
    pointer-events: none;
  }
}

.green {
  .is_active {
    border-color: #40c381;
    background-color: #40c381;
    transition: #40c381;

    i {
      left: 58%;
      transition: 0.5s;
      -webkit-transition: 0.5s;
    }
  }
  .is_active:hover,
  .is_active:focus {
    border-color: #349f6a;
    background-color: #349f6a;
    transition: #349f6a;
    i {
      left: 58%;
    }
  }
}
.blue {
  .is_active {
    border-color: #29a1f7;
    background-color: #29a1f7;
    transition: #29a1f7;

    i {
      left: 58%;
      transition: 0.5s;
      -webkit-transition: 0.5s;
    }
  }
  .is_active:hover,
  .is_active:focus {
    border-color: #29a1f7;
    background-color: #29a1f7;
    transition: #29a1f7;
    i {
      left: 58%;
    }
  }
}
</style>
