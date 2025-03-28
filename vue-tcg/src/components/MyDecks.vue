<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_API_DECKS } from '@/utilities/const.js';
import { apiGet, apiPost } from '@/services/ApiService.js';
import SearchBar from '@/components/SearchBar.vue';

const decks = ref([]);
const router = useRouter();
const newDeckName = ref('');
const newDeckCards = ref('');
const errorMessage = ref('');

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
    await fetchDecks();
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
</script>

<template>
  <div class="container">
    <SearchBar />
    <h1 class="title">My Decks</h1>
    <div class="add-deck-form">
      <h2>Add New Deck</h2>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <input v-model="newDeckName" placeholder="Deck Name" class="input" />
      <input v-model="newDeckCards" placeholder="Card IDs (comma separated)" class="input" />
      <button @click="addDeck" class="add-button">Add Deck</button>
    </div>
    <ul class="deck-list">
      <li v-for="deck in decks" :key="deck.id" @click="goToShowDecks(deck.id)" class="deck-item">
        {{ deck.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}

.add-deck-form {
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.input {
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.add-button {
  background-color: #ff6347;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: block;
  margin: 1rem auto;
}

.add-button:hover {
  background-color: #e5533d;
  transform: scale(1.05);
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.deck-list {
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 500px;
}

.deck-item {
  background-color: #f8f9fa;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
}

.deck-item:hover {
  background-color: #e2e6ea;
}
</style>
