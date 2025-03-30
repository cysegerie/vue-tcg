<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {BASE_API_DECKS} from '@/utilities/const.js';
import {apiGet, apiPost} from '@/services/ApiService.js';
import SearchBar from '@/components/SearchBar.vue';

const storedCards = ref([]);
const selectedCards = ref([]);
const cardQuantities = ref({}); // Pour stocker les quantités de chaque carte
const availableQuantities = ref({}); // Pour stocker les quantités disponibles
const deckName = ref('');
const errorMessage = ref('');
const router = useRouter();

onMounted(() => {
  const allCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
  // Filtrer les doublons en gardant uniquement la première occurrence de chaque carte
  const uniqueCards = allCards.filter((card, index, self) =>
    index === self.findIndex((c) => c.id === card.id)
  );
  storedCards.value = uniqueCards;
  
  // Calculer les quantités disponibles pour chaque carte
  allCards.forEach(card => {
    availableQuantities.value[card.id] = (availableQuantities.value[card.id] || 0) + 1;
    cardQuantities.value[card.id] = 0;
  });
});

const toggleCardSelection = (card) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id);
  if (index === -1) {
    selectedCards.value.push(card);
  } else {
    selectedCards.value.splice(index, 1);
  }
};

const updateQuantity = (card, increment) => {
  const currentQuantity = cardQuantities.value[card.id] || 0;
  const availableQuantity = availableQuantities.value[card.id] || 0;
  const newQuantity = currentQuantity + increment;
  
  if (newQuantity >= 0 && newQuantity <= availableQuantity) {
    cardQuantities.value[card.id] = newQuantity;
    
    // Mettre à jour selectedCards en fonction de la quantité
    if (newQuantity > 0) {
      // Ajouter la carte si elle n'est pas déjà dans selectedCards
      if (!selectedCards.value.some(c => c.id === card.id)) {
        selectedCards.value.push(card);
      }
    } else {
      // Retirer la carte si la quantité est 0
      const index = selectedCards.value.findIndex(c => c.id === card.id);
      if (index !== -1) {
        selectedCards.value.splice(index, 1);
      }
    }
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

  // Créer le deck avec toutes les informations des cartes
  const newDeck = {
    name: deckName.value,
    idUser: Math.floor(Math.random() * 10) + 1,
    cards: selectedCards.value.map(card => ({
      id: card.id,
      name: card.name,
      image: card.image,
      quantity: cardQuantities.value[card.id]
    }))
  };

  try {
    await apiPost(BASE_API_DECKS, newDeck);
    await router.push('/my-decks');
  } catch (error) {
    console.error('Error creating deck:', error);
    errorMessage.value = 'Erreur lors de la création du deck.';
  }
};

// Mettre à jour les cartes stockées si le localStorage change
watch(() => window.localStorage.getItem('boosterCards'), (newValue) => {
  if (newValue) {
    const allCards = JSON.parse(newValue);
    // Filtrer les doublons en gardant uniquement la première occurrence de chaque carte
    const uniqueCards = allCards.filter((card, index, self) =>
      index === self.findIndex((c) => c.id === card.id)
    );
    storedCards.value = uniqueCards;
    // Réinitialiser les quantités pour les nouvelles cartes
    uniqueCards.forEach(card => {
      if (!cardQuantities.value[card.id]) {
        cardQuantities.value[card.id] = 0;
      }
    });
  }
});
</script>

<template>
  <div class="create-deck-container">
    <h1>Créer un nouveau deck avec vos propres cartes</h1>

    <div class="deck-form">
      <label for="deckName">Nom du deck :</label>
      <input id="deckName" v-model="deckName" type="text" placeholder="Entrez le nom du deck" class="deck-name-input" />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <SearchBar :selected-cards="selectedCards" @select-card="toggleCardSelection" />

    <div class="all-cards-section">
      <h2>Toutes vos cartes</h2>
      <div class="cards-container">
        <div
            v-for="card in storedCards"
            :key="card.id"
            class="card-item"
            :class="{ 'new-selected': cardQuantities[card.id] > 0 }"
        >
          <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
          <p>{{ card.name }}</p>
          <div class="quantity-controls">
            <button 
              @click.stop="updateQuantity(card, -1)" 
              class="quantity-btn"
              :disabled="cardQuantities[card.id] <= 0"
            >-</button>
            <span class="quantity">{{ cardQuantities[card.id] }} / {{ availableQuantities[card.id] }}</span>
            <button 
              @click.stop="updateQuantity(card, 1)" 
              class="quantity-btn"
              :disabled="cardQuantities[card.id] >= availableQuantities[card.id]"
            >+</button>
          </div>
        </div>
      </div>
    </div>

    <button @click="createDeck" class="create-deck-button">Créer le deck</button>
  </div>
</template>

<style scoped>
.create-deck-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.deck-form {
  margin-bottom: 2rem;
}

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

.all-cards-section {
  margin-top: 2rem;
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

.card-item img {
  max-width: 100%;
  border-radius: 8px;
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

.quantity-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-btn {
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.quantity-btn:hover {
  background-color: #ff4500;
}

.quantity-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.quantity {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 48px;
  text-align: center;
}
</style>