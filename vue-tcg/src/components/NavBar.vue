<script setup>
import { RouterLink } from 'vue-router';
import { getLinks } from "@/services/LienService.js";

const links = getLinks();
</script>

<template>
  <nav class="navbar">
    <RouterLink v-for="link in links" :key="link.path" :to="link.path" class="nav-link">
      {{ link.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #333;
  padding: 1rem;
  border-radius: 8px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  color: #ff6347;
  transform: scale(1.1);
}
</style>