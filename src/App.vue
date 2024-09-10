<script setup lang="ts">
import { useRouter, useRoute, RouterLink } from 'vue-router'

const isDarkMode = ref(false)
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', String(isDarkMode.value))
}

const router = useRouter()
const route = useRoute()
function toAboutPage() {
  router.push('/about')
}

onMounted(() => {
  console.log('mounted', route)
  console.log('mounted', router)
})
watchEffect(() => {
  console.log(route.name)
})
</script>

<template>
  <div :class="{ dark: isDarkMode }" class="bg-gray-100 dark:bg-darkMode min-h-screen">
    <nav
      class="bg-white shadow dark:bg-darkMode dark:shadow-slate-100"
      v-show="route.name !== 'workCation'"
    >
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0">
              <RouterLink to="/">
                <img class="h-8 w-auto" src="./assets/logo.svg" alt="TailwindCSS" />
              </RouterLink>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <a @click="toAboutPage" class="nav-link">About</a>
              </div>
            </div>
          </div>
          <div>
            <button
              @click="toggleDarkMode"
              class="text-gray-900 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main :class="{ 'py-10': route.name !== 'workCation' }">
      <router-view></router-view>
    </main>
  </div>
</template>
<style scoped></style>
