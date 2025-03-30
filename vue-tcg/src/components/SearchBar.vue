<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  selectedCards: {
    type: Array,
    default: () => []
  }
});

const query = ref('');
const allCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
// Filtrer les doublons en gardant uniquement la première occurrence de chaque carte
const storedCards = allCards.filter((card, index, self) =>
  index === self.findIndex((c) => c.id === card.id)
);
const filteredCards = ref([...storedCards]);

const emit = defineEmits(['select-card']);

const searchCards = () => {
  const searchTerm = query.value.toLowerCase().trim();
  filteredCards.value = searchTerm
      ? storedCards.filter(card => {
          const cardName = card.name.toLowerCase().trim();
          return cardName.startsWith(searchTerm);
      })
      : [...storedCards];
};

const toggleCardSelection = (card) => {
  emit('select-card', card);
};

watch(query, searchCards);
</script>

<template>
  <div class="search-container">
    <input v-model="query" class="search-input" placeholder="Rechercher une carte par nom ou ID..." />
    
    <div v-if="query.length > 0" class="search-results">
      <h2>Résultats de recherche</h2>
      <div v-if="filteredCards.length" class="cards-container">
        <div
            v-for="card in filteredCards"
            :key="card.id"
            class="card-item"
            :class="{ 'new-selected': selectedCards.some(c => c.id === card.id) }"
            @click="toggleCardSelection(card)"
        >
          <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
          <p>{{ card.name }}</p>
        </div>
      </div>
      <div v-else class="no-results">Aucune carte trouvée</div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  margin-bottom: 2rem;
}

.search-input {
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #ff6347;
  outline: none;
}

.search-results {
  margin-top: 1rem;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.card-item {
  background-color: #222;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 150px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-item:hover {
  transform: scale(1.05);
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}

.no-results {
  color: #888;
  font-size: 1.2rem;
  margin-top: 1rem;
  text-align: center;
}

.card-item.new-selected {
  outline: 3px solid #ffcc00;
  background: linear-gradient(145deg, #ffcc00, #ff9900);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.8);
}

.card-item.new-selected img {
  filter: brightness(1.2);
}
</style>
