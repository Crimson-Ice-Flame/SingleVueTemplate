<template>
  <a class="btn_notice" @click="handleClick">
    <i :class="['icon', icon]"></i>
    <span v-if="count > 0" class="count">{{ count > 99 ? '99+' : count }}</span>
  </a>
</template>

<script setup lang="ts">
interface IButtonData {
  icon: string; // icon 的 class
  count: number; // 未讀通知的數量
}

const emit = defineEmits(['click']);

withDefaults(defineProps<IButtonData>(), {
  count: 0
});

const handleClick = () => {
  emit('click');
};
</script>
