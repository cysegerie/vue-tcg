<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {BASE_API_CARDS, BASE_API_DECKS} from '@/utilities/const.js';
import {apiGet} from '@/services/ApiService.js';

const route = useRoute();
const deck = ref(null);
const error = ref(null);
const deckId = route.params.deckId;

const fetchCardDetails = async (cardId) => {
  try {
    return await apiGet(`${BASE_API_CARDS}/${cardId}`);
  } catch (err) {
    console.error(`Error fetching card ${cardId}:`, err);
    return null;
  }
};

const fetchDeck = async () => {
  try {
    const response = await apiGet(`${BASE_API_DECKS}/${deckId}`);
    if (response) {
      console.log('Deck response:', response);
      const cards = await Promise.all(response.cards.map(cardId => fetchCardDetails(cardId)));
      deck.value = { ...response, cards: cards.filter(card => card !== null) };
    } else {
      throw new Error(`No deck found with ID ${deckId}`);
    }
  } catch (err) {
    error.value = err.message;
    console.error(`Error fetching deck ${deckId}:`, err);
  }
};

onMounted(() => {
  fetchDeck();
});
</script>

<template>
  <div v-if="error" class="error-container">
    <div class="error-message">{{ error }}</div>
  </div>
  <div v-else-if="deck" class="deck-container">
    <div class="deck-header">
      <h1>{{ deck.name }}</h1>
      <p class="deck-count">{{ deck.cards.length }} cartes</p>
    </div>
    <div class="cards-grid">
      <div v-for="card in deck.cards" :key="card.id" class="card-item">
        <RouterLink :to="`/cards/${card.id}`" class="card-link">
          <div class="card-image-container">
            <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
            <div class="card-overlay">
              <div class="card-types" v-if="card.types">
                <span v-for="type in card.types" :key="type" class="type-badge">{{ type }}</span>
              </div>
            </div>
          </div>
          <p class="card-name">{{ card.name }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Chargement...</p>
  </div>
</template>

<style scoped>
.deck-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(26, 27, 30, 0.95) 100%);
}

.deck-header {
  text-align: center;
  margin-bottom: 2rem;
}

.deck-count {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.card-item {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-primary);
}

.card-link {
  text-decoration: none;
  color: var(--text-primary);
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
  transition: var(--transition);
}

.card-item:hover .card-name {
  color: var(--primary-color);
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(26, 27, 30, 0.95) 100%);
}

.error-message {
  background: rgba(255, 101, 132, 0.1);
  color: var(--secondary-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-align: center;
  max-width: 500px;
  border: 1px solid rgba(255, 101, 132, 0.2);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(26, 27, 30, 0.95) 100%);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--primary-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .deck-container {
    padding: 1rem;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>