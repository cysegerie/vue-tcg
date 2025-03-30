<script setup>
import { RouterLink } from 'vue-router';
import { getLinks } from "@/services/LienService.js";

const links = getLinks();
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-links">
        <RouterLink 
          v-for="link in links" 
          :key="link.path" 
          :to="link.path" 
          class="nav-link"
          active-class="nav-link-active"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(26, 27, 30, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-logo {
  width: 32px;
  height: 32px;
  animation: spin 4s linear infinite;
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: var(--transition);
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link:hover::after {
  width: 80%;
}

.nav-link-active {
  color: var(--text-primary);
  background: rgba(108, 99, 255, 0.1);
}

.nav-link-active::after {
  width: 80%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>