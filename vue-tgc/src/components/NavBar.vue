<script setup>
import { RouterLink } from 'vue-router';
import { getLinks } from "@/services/LienService.js";

const links = getLinks();
</script>

<template>
  <nav>
    <RouterLink v-for="link in links" :to= "link.path" >
      {{ link.label }}
    </RouterLink>
  </nav>
</template>
