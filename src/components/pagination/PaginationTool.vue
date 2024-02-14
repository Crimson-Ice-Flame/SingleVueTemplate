<template>
  <div class="pagination_wrapper">
    <n-pagination
      v-model:page="pageCurrent.page"
      v-model:page-size="pageCurrent.page_size"
      v-model:page-count="pageCurrent.total"
      show-size-picker
      :page-sizes="pageSizes ?? [10, 20, 30, 40, 50]"
      @update:page="handleCurrentChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {computed } from 'vue';
import { type PageDataType } from '../../models/components/pagination';

const emits = defineEmits(['pageData:update','changePage', 'changeSize']);
const props = defineProps<{
  pageData: PageDataType;
  pageSizes?: number[];
}>();

const pageCurrent = computed({
  get: () => props.pageData,
  set: (val: PageDataType) => {
    emits('pageData:update', val);
  }
});

const handleSizeChange = (val: number) => {
  emits('changeSize', val);
};

const handleCurrentChange = (val: number) => {
  emits('changePage', val);
};

</script>

<style lang="scss" scoped>
.pagination_wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
