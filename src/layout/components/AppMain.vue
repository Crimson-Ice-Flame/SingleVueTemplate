<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, h } from 'vue'

const route = useRoute()

const key = computed(() => {
  return route.path
})

// 重新命名component
const wrapperMap = new Map()
const wrap = (name: any, component: any) => {
  let wrapper
  const wrapperName = name
  if (wrapperMap.has(wrapperName)) {
    wrapper = wrapperMap.get(wrapperName)
  } else {
    wrapper = {
      name: wrapperName,

      render() {
        return h('div', { className: 'vaf-page-wrapper' }, component)
      }
    }

    wrapperMap.set(wrapperName, wrapper)
  }

  return h(wrapper)
}
</script>

<template>
  <div class="app_main">
    <router-view v-slot="{ Component, route }" class="main_content">
      <keep-alive>
          <component :is="wrap(route.path, Component)" :key="key" />
        </keep-alive>
      <!-- <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition> -->
    </router-view>
  </div>
</template>
