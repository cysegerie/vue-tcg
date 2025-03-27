<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_API_DECKS } from '@/utilities/const.js';
import { apiGet, apiPost } from '@/services/ApiService.js';

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
</script>

<template>
  <h1>My Decks</h1>
  <div>
    <h2>Add New Deck</h2>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <input v-model="newDeckName" placeholder="Deck Name" />
    <input v-model="newDeckCards" placeholder="Card IDs (comma separated)" />
    <button @click="addDeck">Add Deck</button>
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
</style>