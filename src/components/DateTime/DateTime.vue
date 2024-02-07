<template>
  <span>
    {{ dateTime }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import dayjs from 'dayjs';

interface Props {
  timestamp?: number | string;
  type?: string;
  emptyTag?: string;
}

const props = defineProps<Props>();

const format = computed(() => {
  switch (props.type) {
    case 'short': {
      return 'YYYY-MM-DD';
    }
    case 'year_month': {
      return 'YYYY-MM';
    }
    case 'month_day': {
      return 'MM-DD';
    }
    case 'time': {
      return 'HH:mm';
    }
    case 'long':
    default: {
      return 'YYYY-MM-DD HH:mm';
    }
  }
});

const dateTime = computed(() => {
  if (props.timestamp !== undefined && props.timestamp !== null) {
    if (typeof props.timestamp === 'number') {
      return dayjs.unix(props.timestamp).format(format.value);
    } else {
      return dayjs(props.timestamp).format(format.value);
    }
  } else {
    return props.emptyTag ?? '';
  }
});
</script>
