<!-- vue-tcg/src/components/SearchBar.vue -->
<template>
  <div>
    <input v-model="query" @input="searchCards" placeholder="Search Pokémon" />
    <div v-if="cards.length" class="cards-container">
      <div v-for="card in cards" :key="card.id" class="card-item">
        <img :src="`${card.image}/low.jpg`" alt="Card Image" />
        <p>{{ card.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { apiGet } from '@/services/ApiService.js';
import { BASE_API_CARDS } from '@/utilities/const.js';

const query = ref('');
const cards = ref([]);

const searchCards = async () => {
  if (query.value.length > 2) {
    try {
      const response = await apiGet(`${BASE_API_CARDS}?name=${query.value}`);
      cards.value = response.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  } else {
    cards.value = [];
  }
};
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.card-item {
  background-color: #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  width: calc(100% / 5 - 1rem);
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}
</style>