<script setup>
import { ref, watch } from 'vue';

const query = ref('');
const storedCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
const filteredCards = ref([]);
const selectedCards = ref([]);

const searchCards = () => {
  if (query.value.length > 0) {
    filteredCards.value = storedCards.filter(card =>
        card.name.toLowerCase().includes(query.value.toLowerCase()) ||
        card.id.toLowerCase().includes(query.value.toLowerCase())
    );
  } else {
    filteredCards.value = [];
  }
};

const toggleCardSelection = (card) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id);
  if (index === -1) {
    selectedCards.value.push(card);
  } else {
    selectedCards.value.splice(index, 1);
  }
  $emit('select-card', selectedCards.value);
};

watch(query, searchCards);

defineProps(['onSelectCard']);
</script>

<template>
  <input v-model="query" class="search-input" placeholder="Rechercher une carte" />
  <h2>Carte trouvées </h2>
  <div v-if="filteredCards.length" class="cards-container">
    <div
        v-for="card in filteredCards"
        :key="card.id"
        class="card-item"
        :class="{ 'selected': selectedCards.includes(card) }"
        @click="toggleCardSelection(card)"
    >
      <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
      <p>{{ card.name }}</p>
    </div>
  </div>
  <div v-else-if="query.length > 0" class="no-results">Aucune carte trouvée</div>
</template>

<style scoped>
.search-input {
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #ff6347;
  outline: none;
}

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
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-item:hover {
  transform: scale(1.1);
}

.card-item.selected {
  border: 2px solid #ff6347;
  background: linear-gradient(145deg, #400, #700);
  box-shadow: 0 0 15px #ff6347;
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}

.no-results {
  color: #888;
  font-size: 1.2rem;
  margin-top: 1rem;
}
</style>