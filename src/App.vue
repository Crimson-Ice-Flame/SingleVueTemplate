<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

import { ref } from 'vue';

const size = ref(10);

function changeSize() {
  size.value = 40;
}
</script>

<template>
  <div class="grid lg:grid-cols-2 2xl:grid-cols-5 bg-gray-100">
    <div
      class="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full 2xl:mr-0 2xl:col-span-2 " 
    >
      <div class="xl:max-w-xl">
        <img :class="`h-${size}`" src="./assets/banner.svg" alt="Work Cation Logo" />
        <img
          class="mt-6 rounded-lg shadow-xl sm:mt-8 sm:h-64 sm:w-full sm:object-cover lg:hidden"
          src="./assets/beach-work.jpg"
          alt="Woman workcationing on the beach"
        />

        <h1
          class="mt-6 text-gray-900 font-bold text-2xl sm:mt-8 sm:text-4xl lg:text-3xl xl:text-4xl font-headline tracking-tight"
        >
          You can work from anywhere.
          <br class="hidden lg:inline" />
          <span class="text-ice-dark">Take advantage of it.</span>
        </h1>
        <p class="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
          Workcation helps you find work-friendly rentals in beautiful locations so you can enjoy
          some nice weather even when you're not on vacation.
        </p>
        <div class="mt-4 space-x-2 sm:mt-6">
          <a class="btn btn-primary hover:-translate-y-0.5 transition transform"
            href="#"
            >Book your escape</a
          >
          <a class="btn btn-light"
            href="#"
           
            >Learn More</a
          >
          <button class="btn" @click="changeSize">Change</button>
        </div>
      </div>
    </div>
    <div class="hidden relative lg:block 2xl:col-span-3">
      <img
        class="absolute inset-0 w-full h-full object-cover object-center"
        src="./assets/beach-work.jpg"
        alt="Woman workcationing on the beach"
      />
    </div>
  </div>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main> -->
</template>
<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
