<template>
  <div class="bg-white dark:bg-darkModeSecondary overflow-hidden">
    <div
      class="p-6 bg-white dark:bg-darkModeSecondary border-b border-gray-200 dark:border-darkModeSecondary"
    >
      <!-- Your content goes here -->
      <h1 class="text-3xl font-bold dark:text-white">Welcome to TailwindCSS</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        This is a simple example of a layout using TailwindCSS.
        {{ $t('welcome') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
