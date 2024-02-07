<template>
  <div class="app_wrapper">
    <n-grid cols="6" item-responsive>
      <n-grid-item span="7">
        <div class="light-green">
          <Navbar></Navbar>
        </div>
      </n-grid-item>
      <n-grid-item span="7">
        <n-layout class="slider_height" has-sider>
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
          >
            <Sidebar></Sidebar>
          </n-layout-sider>
          <n-layout>
            <div class="app_main_height">
              <AppMain></AppMain>
            </div>
            <Footer></Footer>
          </n-layout>
        </n-layout>
      </n-grid-item>
    </n-grid>
    <!-- <n-grid cols="6" item-responsive>
      <n-grid-item span="7">
        <div class="light-green">
          <Navbar></Navbar>
        </div>
      </n-grid-item>
      <n-grid-item span="1">
        <div class="slider_height">
          <Sidebar></Sidebar>
        </div>
      </n-grid-item>
      <n-grid-item span="5">
        <n-grid cols="1" item-responsive>
          <n-grid-item span="1">
            <div class="app_main_height">
              <AppMain></AppMain>
            </div>
          </n-grid-item>
          <n-grid-item span="1">
            <Footer></Footer>
          </n-grid-item>
        </n-grid>
      </n-grid-item>
    </n-grid> -->
    <!-- <Navbar></Navbar>
    <div class="app_container">
      <Sidebar></Sidebar>
      <div class="app_container_main">
        <AppMain></AppMain>
        <Footer></Footer>
      </div>
    </div> -->
  </div>
</template>

<script setup name="layout" lang="ts">
import { ref } from 'vue';
import { Navbar, Sidebar, AppMain, Footer } from './components/index.js'

const collapsed = ref(false);
</script>
<style scoped lang="scss">
.light-green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: rgba(0, 128, 0, 0.12);
}
.slider_height {
  height: calc(100vh - 80px);
}
.app_main_height {
  height: calc(100vh - 80px - 50px);
}
</style>
