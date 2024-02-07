<template>
  <div class="sidebar">
    <n-scrollbar style="max-height: calc(100vh)" trigger="none">
      <n-menu :options="menuOptions" @update:value="handleUpdateValue" accordion />
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, h, type Component } from 'vue'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import CommunityIcon from '@/components/icons/IconCommunity.vue'
import SupportIcon from '@/components/icons/IconSupport.vue'
import { NIcon } from 'naive-ui'

import { appAuthStore } from '@/stores/user'

const authStore = appAuthStore()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home'
          }
        },
        { default: () => '回家' }
      ),
    key: 'go-back-home',
    icon: renderIcon(CommunityIcon)
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    icon: renderIcon(SupportIcon),
    children: [
      {
        label: '人物',
        key: 'people',
        children: [
          {
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    name: 'board'
                  }
                },
                { default: () => '旁白' }
              ),
            key: 'navigate'
          },
          {
            label: '羊男',
            key: 'sheep-man3'
            
            
          }
        ]
      }
    ]
  },{
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'account'
          }
        },
        { default: () => '帳號管理' }
      ),
    key: 'go-back-account',
    icon: renderIcon(CommunityIcon)
  }
]

const handleUpdateValue = (key: string, item: MenuOption) => {
  console.log('[onUpdate:value]: ' + JSON.stringify(key))
  console.log('[onUpdate:value]: ' + JSON.stringify(item))
}

onMounted(() => {
  console.log('mounted', authStore.permission)
})

watch(
  () => authStore.permission,
  (newVal) => {
    console.log('ggg')
    if(authStore.permission === undefined) return ;
    if (authStore.permission.length > 0) {
      const newRoute = authStore.permission.map((item) => {
        return {
          label: item.name
            ? () =>
                h(
                  RouterLink,
                  {
                    to: {
                      name: child.name
                    }
                  },
                  { default: () => child.name }
                )
            : item.name,
          key: item.name,
          icon: renderIcon(SupportIcon),
          children: item.children.map((child) => {
            return {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: {
                      name: child.name
                    }
                  },
                  { default: () => child.name }
                ),
              key: child.name
            }
          })
        }
      })
      menuOptions.push(newRoute)
    }
  },
  { immediate: true}
)
</script>
