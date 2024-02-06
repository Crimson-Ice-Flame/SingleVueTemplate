<template>
  <div class="footer">
    <p>Copyright © 2023 Incore. All rights reserved. {{ version }}</p>
  </div>
</template>

<script name="layout" lang="ts" setup>
import { computed } from 'vue';
import { useInfoStore } from '@/stores/app';

const app = useInfoStore();
// 取得版本號
const version = computed(() => app.version);
</script>
