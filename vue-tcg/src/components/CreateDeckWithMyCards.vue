<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_API_DECKS } from '@/utilities/const.js';
import { apiPost, apiGet } from '@/services/ApiService.js';
import SearchBar from '@/components/SearchBar.vue';

const storedCards = ref([]);
const selectedCards = ref([]);
const deckName = ref('');
const errorMessage = ref('');
const router = useRouter();

onMounted(() => {
  let savedCards;
  savedCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
  storedCards.value = savedCards;
});

const updateSelectedCards = (cards) => {
  selectedCards.value = cards;
};

const toggleCardSelection = (card) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id);
  if (index === -1) {
    selectedCards.value.push(card);
  } else {
    selectedCards.value.splice(index, 1);
  }
};

const checkDeckNameExists = async (name) => {
  try {
    const decks = await apiGet(BASE_API_DECKS);
    return decks.some(deck => deck.name.toLowerCase() === name.toLowerCase());
  } catch (error) {
    console.error('Error checking deck names:', error);
    return false;
  }
};

const createDeck = async () => {
  if (!deckName.value) {
    errorMessage.value = 'Veuillez entrer un nom de deck.';
    return;
  }
  if (selectedCards.value.length === 0) {
    errorMessage.value = 'Veuillez sélectionner au moins une carte.';
    return;
  }

  const nameExists = await checkDeckNameExists(deckName.value);
  if (nameExists) {
    errorMessage.value = 'Le nom du deck existe déjà. Veuillez en choisir un autre.';
    return;
  }

  const newDeck = {
    name: deckName.value,
    cards: selectedCards.value.map(card => card.id)
  };

  try {
    await apiPost(BASE_API_DECKS, newDeck);
    await router.push('/my-decks');
  } catch (error) {
    console.error('Error creating deck:', error);
    errorMessage.value = 'Erreur lors de la création du deck.';
  }
};
</script>

<template>
  <h1>Créer un nouveau deck avec vos propre cartes</h1>

  <label for="deckName">Nom du deck :</label>
  <input id="deckName" v-model="deckName" type="text" placeholder="Entrez le nom du deck" class="deck-name-input" />

  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

  <SearchBar @select-card="updateSelectedCards" />

  <div v-if="storedCards.length">
    <h2>Cartes disponibles</h2>
    <div class="cards-container">
      <div
          v-for="card in storedCards"
          :key="card.id"
          class="card-item"
          :class="{ 'selected': selectedCards.includes(card) }"
          @click="toggleCardSelection(card)"
      >
        <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
        <p>{{ card.name }}</p>
      </div>
    </div>
    <button @click="createDeck" class="create-deck-button">Créer le deck</button>
  </div>
  <div v-else>
    <p>Vous n'avez aucune carte en stock.</p>
  </div>
</template>

<style scoped>
.deck-name-input {
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  font-size: 1rem;
  background-color: #f8f9fa;
}

.create-deck-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(145deg, #ff6347, #b0301e);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(255, 99, 71, 0.7);
  z-index: 1000;
}

.create-deck-button:hover {
  box-shadow: 0 0 25px rgba(255, 99, 71, 1);
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;
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
</style>