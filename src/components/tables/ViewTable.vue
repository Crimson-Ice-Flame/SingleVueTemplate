<template>
  <div>
    <el-table
      border
      header-row-class-name="tableHeader"
      scrollbar-always-on
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selection" type="selection" label="#" width="45" />
      <el-table-column v-if="haveIndexColumn" type="index" label="#" width="45" />
      <template v-for="item in tableList" :key="item.id">
        <el-table-column
          v-if="item.elementName === 'slot'"
          :sortable="item.sortable"
          :label="item.label"
          :width="item.width"
          :prop="item.name"
          :fixed="item.fixed"
        >
          <template #default="rowData">
            <slot :name="item.name" :row="rowData.row" :rowIndex="rowData.$index"></slot
          ></template>
        </el-table-column>
        <el-table-column
          v-else
          :fixed="item.fixed"
          :prop="item.name"
          :sortable="item.sortable"
          :label="item.label"
          :width="item.width"
        />
      </template>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
 import { ElTable } from 'element-plus'
import type { TableField } from '@/models/components/viewTable';

defineProps<{
  haveIndexColumn: boolean;
  tableList: TableField[];
  tableData: any;
  tableRowClassName?: string;
  selection?: boolean;
}>();

const emits = defineEmits(['updateSelect']);
// checkbox選項
const handleSelectionChange = (val: any) => {
  emits('updateSelect', val);
};
</script>
<style scoped lang="scss">
.blue {
  :deep(.tableHeader) > th {
    background-color: #1f9ffb;
    color: #fff;
    font-size: 16px;
  }
  :deep(.el-table) {
    border-radius: 5px;
  }
}
.green {
  :deep(.tableHeader) > th {
    background-color: #00b5ad;
    color: #fff;
    font-size: 16px;
  }
  :deep(.el-table) {
    border-radius: 5px;
  }
}

::v-deep .redRow {
  --el-table-tr-bg-color: #ffe5e5;
}
</style>
