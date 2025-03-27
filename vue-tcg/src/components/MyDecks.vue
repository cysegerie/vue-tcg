<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_API_DECKS } from '@/utilities/const.js';
import { apiGet, apiPost } from '@/services/ApiService.js';
import SearchBar from "@/components/SearchBar.vue";

const decks = ref([]);
const router = useRouter();
const newDeckName = ref('');
const newDeckCards = ref('');
const errorMessage = ref('');

const query = ref('');
const cards = ref([]);

const fetchDecks = async () => {
  try {
    decks.value = await apiGet(BASE_API_DECKS);
  } catch (error) {
    console.error('Error fetching decks:', error);
  }
};

const addDeck = async () => {
  if (!newDeckName.value || !newDeckCards.value) {
    errorMessage.value = 'All fields are required';
    return;
  }

  const newDeck = {
    name: newDeckName.value,
    idUser: Math.floor(Math.random() * 10) + 1,
    cards: newDeckCards.value.split(',').map(card => card.trim())
  };

  try {
    await apiPost(BASE_API_DECKS, newDeck);
    newDeckName.value = '';
    newDeckCards.value = '';
    errorMessage.value = '';
    fetchDecks();
  } catch (error) {
    console.error('Error adding deck:', error);
  }
};

const goToShowDecks = (deckId) => {
  router.push({ name: 'ShowDecks', params: { deckId } });
};

onMounted(() => {
  fetchDecks();
});

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

<template>
  <div>
    <div class="search-bar-container">  <!-- La SearchBAr -->
      <input v-model="query" @input="searchCards" placeholder="Search Pokémon" class="search-input" />
      <div v-if="cards.length" class="cards-container">
        <div v-for="card in cards" :key="card.id" class="card-item">
          <img :src="`${card.image}/low.jpg`" alt="Card Image" />
          <p>{{ card.name }}</p>
        </div>
      </div>
    </div>
    <h1>My Decks</h1>

    <div>
      <h2>Add New Deck</h2>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <input v-model="newDeckName" placeholder="Deck Name" />
      <input v-model="newDeckCards" placeholder="Card IDs (comma separated)" />
      <button @click="addDeck">Add Deck</button>
    </div>

  </div>
  <ul>
    <li v-for="deck in decks" :key="deck.id" @click="goToShowDecks(deck.id)">
      {{ deck.name }}
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f8f9fa;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}

li:hover {
  background-color: #e2e6ea;
}

.error {
  color: red;
  margin-bottom: 0.5rem;
}

input {
  display: block;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #ff6347;
  transform: scale(1.1);
}

.search-bar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.search-input {
  width: 33%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
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
</style>