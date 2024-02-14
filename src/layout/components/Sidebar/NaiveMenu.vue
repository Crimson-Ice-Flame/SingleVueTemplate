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
import { apiGetUserPermission } from '@/apis/permission'

const authStore = appAuthStore()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const defaultPermission = [
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
const menuOptions = ref<MenuOption[]>([])

const handleUpdateValue = (key: string, item: MenuOption) => {
  console.log('[onUpdate:value]: ' + JSON.stringify(key))
  console.log('[onUpdate:value]: ' + JSON.stringify(item))
}

const loadUserPermission = () => {
  apiGetUserPermission().then((res) => {
    if (res.status === 1) {
      menuOptions.value = defaultPermission.concat(res.result)
    }
  })
}

onMounted(() => {
  loadUserPermission();
  // menuOptions.value = [
  //   {
  //     label: () =>
  //       h(
  //         RouterLink,
  //         {
  //           to: {
  //             name: 'home'
  //           }
  //         },
  //         { default: () => '回家' }
  //       ),
  //     key: 'go-back-home',
  //     icon: renderIcon(CommunityIcon)
  //   },
  //   {
  //     label: '舞，舞，舞',
  //     key: 'dance-dance-dance',
  //     icon: renderIcon(SupportIcon),
  //     children: [
  //       {
  //         label: '人物',
  //         key: 'people',
  //         children: [
  //           {
  //             label: () =>
  //               h(
  //                 RouterLink,
  //                 {
  //                   to: {
  //                     name: 'board'
  //                   }
  //                 },
  //                 { default: () => '旁白' }
  //               ),
  //             key: 'navigate'
  //           },
  //           {
  //             label: '羊男',
  //             key: 'sheep-man3'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     label: () =>
  //       h(
  //         RouterLink,
  //         {
  //           to: {
  //             name: 'account'
  //           }
  //         },
  //         { default: () => '帳號管理' }
  //       ),
  //     key: 'go-back-account',
  //     icon: renderIcon(CommunityIcon)
  //   }
  // ]
})

</script>
