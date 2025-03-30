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
    <div class="search-input-container">
      <input 
        v-model="query" 
        class="search-input" 
        placeholder="Rechercher une carte par nom ou ID..." 
        type="text"
      />
      <span class="search-icon">🔍</span>
    </div>
    
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
          <div class="card-image-container">
            <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
            <div class="card-overlay">
              <div class="card-types" v-if="card.types">
                <span v-for="type in card.types" :key="type" class="type-badge">{{ type }}</span>
              </div>
            </div>
          </div>
          <p class="card-name">{{ card.name }}</p>
          <p class="card-id">ID: {{ card.id }}</p>
        </div>
      </div>
      <div v-else class="no-results">
        <span class="no-results-icon">🔍</span>
        <p>Aucune carte trouvée</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  margin-bottom: 2rem;
  max-width: 500px;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  background: var(--card-background);
  color: var(--text-primary);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.2rem;
  pointer-events: none;
}

.search-results {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.search-results h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: var(--background-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-primary);
}

.card-image-container {
  position: relative;
  width: 100%;
  padding-top: 140%;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.card-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  transform: translateY(100%);
  transition: var(--transition);
}

.card-item:hover .card-overlay {
  transform: translateY(0);
}

.card-types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  background: var(--gradient-secondary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-name {
  color: var(--text-primary);
  font-weight: 500;
  margin: 0.5rem 0;
  text-align: center;
}

.card-id {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.no-results-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-item.new-selected {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
}

.card-item.new-selected::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  pointer-events: none;
}

@media (max-width: 768px) {
  .search-input {
    font-size: 1rem;
    padding: 0.8rem 2.5rem 0.8rem 1rem;
  }

  .search-icon {
    right: 0.8rem;
    font-size: 1rem;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>
