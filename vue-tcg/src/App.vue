<script setup>
import NavBar from "./components/LienService.vue";
import { RouterView } from 'vue-router';

console.log("NavBar Loaded", NavBar);
</script>


<template>
  <header>
    <NavBar/>
  </header>

  <main>
    <RouterView />
  </main>
</template>


<style scoped>

</style>
