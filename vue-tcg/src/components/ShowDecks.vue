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
  <div v-if="error">
    <p>Error: {{ error }}</p>
  </div>
  <div v-else-if="deck">
    <h1>{{ deck.name }}</h1>
    <div class="cards-container">
      <div v-for="card in deck.cards" :key="card.id" class="card-item">
        <RouterLink :to="`/cards/${card.id}`" class="card-link">
          <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
          <p>{{ card.name }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: #fff;
}

.card-link:hover {
  text-decoration: underline;
  color: #ff6347;
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
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}

p {
  margin: 0;
}
</style>