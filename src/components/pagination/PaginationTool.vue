<template>
  <div class="pagination_wrapper">
    <n-pagination
      v-model:page="pageCurrent.page"
      v-model:page-size="pageCurrent.page_size"
      v-model:page-count="pageCurrent.page_count"
      show-size-picker
      :page-sizes="pageSizes ?? defaultPageSizes"
      @update:page="handleCurrentChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type PageDataType } from '../../models/components/pagination'

const emits = defineEmits(['pageData:update', 'changePage', 'changeSize'])
const props = defineProps<{
  pageData: PageDataType
  pageSizes?: number[]
}>()

const pageCurrent = computed({
  get: () => props.pageData,
  set: (val: PageDataType) => {
    emits('pageData:update', val)
  }
})

const handleSizeChange = (val: number) => {
  emits('changeSize', val)
}

const handleCurrentChange = (val: number) => {
  emits('changePage', val)
}

const defaultPageSizes = [
  {
    label: '10／每頁',
    value: 10
  },
  {
    label: '20／每頁',
    value: 20
  },
  {
    label: '30／每頁',
    value: 30
  },
  {
    label: '40／每頁',
    value: 40
  },
  {
    label: '50／每頁',
    value: 50
  }
]
</script>

<style lang="scss" scoped>
.pagination_wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
