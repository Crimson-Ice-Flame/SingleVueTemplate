<template>
  <div class="label_width_auto searchBar">
    <n-grid :cols="props.searchList.length +1" :x-gap="24" >
      <template v-for="(item, key) in props.searchList" :key="key">
        <n-form-item-gi v-if="item.elementName === 'nSelect'" label-placement="left" :class="item.class ?? ''">
          <template v-if="item.label" #label>
            {{ item.label }}
          </template>
          <n-select
            v-model:value="searchData[item.name]"
            max-tag-count="responsive"
            :options="item.selectOptions"
            :multiple="item.multiple"
            :label-field="item.option_label"
            :value-field="item.option_value"
            :placeholder="item.placeholder ?? '請選擇'"
            @update:value="item.changeEvent ? item.changeEvent : null"
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="item.elementName === 'nInput'" label-placement="left" :class="item.class ?? ''">
          <template v-if="item.label" #label>
            {{ item.label }}
          </template>
          <n-input
            v-model:value="searchData[item.name]"
            :placeholder="item.placeholder ?? ' '"
            :type="item.elementType"
            @update:value="item.changeEvent"
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="item.elementName === 'nInputNumber'" label-placement="left" :class="item.class ?? ''">
          <template v-if="item.label" #label>
            {{ item.label }}
          </template>
          <n-input-number
          v-model:value="searchData[item.name]"
            :placeholder="item.placeholder"
            :min="item.min"
            :max="item.max"
            :controls="false"
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="item.elementName === 'nDatepicker'" label-placement="left" class="form_datePicker">
          <template v-if="item.label" #label>
            {{ item.label }}
          </template>
          <n-date-picker
            v-model="searchData[item.name]"
            :type="item.elementType"
            :format="item.format"
            :value-format="item.valueFormat ?? 'X'"
            :placeholder="item.placeholder"
            :disabled-date="(current: any) => dateDisabled(current, { start: item.startTimestampField ? searchData[item.startTimestampField] : undefined, end: item.endTimestampField ? searchData[item.endTimestampField] : undefined },true)"
            @change="item.changeEvent"
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="item.elementName === 'slot'" label-placement="left" :class="item.class ?? ''">
          <template v-if="item.label" #label>
            {{ item.label }}
          </template>
          <slot :name="item.name" :data="searchData"></slot>
        </n-form-item-gi>
      </template>
      <n-form-item-gi  label-placement="left">
          <n-button
            v-if="!searchHidden"
            class="btn_search"
            @click="handleSearchClick()"
          >
       查詢
      </n-button>
        </n-form-item-gi>
    </n-grid >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
// components

// types
import type { SearchToolProps } from '@/models/components/searchTool';
// utils
import { dateDisabled } from '@/utils/validate';


const props = defineProps<{
  searchModel: any;
  searchList: SearchToolProps[];
  searchHidden?: boolean;
}>();

const emits = defineEmits(['handleSearchClick','modelValue:searchModel']);

const searchData = computed({
  get: () => props.searchModel,
  set: (value) => {
    emits('modelValue:searchModel', value);
  }

});


const handleSearchClick = () => {
  emits('handleSearchClick', searchData.value);
};

</script>
