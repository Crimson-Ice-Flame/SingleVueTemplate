<template>
  <div class="error_page">
    <div class="error_content">
      <div class="heradline">
        <h1>Oh no...</h1>
        <div class="error-text">404 error</div>
        <p>一不小心闖進未知領域，請點擊下方按鈕返回首頁</p>
        <n-button class="btn_goBack" secondary @click="goBack">
          回首頁
          <img src="@/assets/images/errorPage/go_back_icon.png" />
        </n-button>
      </div>
      <div class="img_content">
        <img src="@/assets/images/errorPage/error-image.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';

const goBack = () => {
  router.push('/dashboard');
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/404.scss';
</style>
