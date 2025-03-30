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

  // Créer le deck avec les IDs des cartes répétés selon la quantité
  const cardIds = selectedCards.value.flatMap(card => {
    const quantity = cardQuantities.value[card.id];
    return Array(quantity).fill(card.id);
  });

  const newDeck = {
    name: deckName.value,
    idUser: Math.floor(Math.random() * 10) + 1,
    cards: cardIds
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
    <h1>Créer un nouveau deck</h1>
    <p class="subtitle">Construisez votre deck avec vos cartes Pokémon</p>

    <div class="deck-form">
      <label for="deckName">Nom du deck</label>
      <input 
        id="deckName" 
        v-model="deckName" 
        type="text" 
        placeholder="Entrez le nom du deck (ex: Alexandre Ruiz le goat)" 
        class="deck-name-input" 
      />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <SearchBar :selected-cards="selectedCards" @select-card="toggleCardSelection" />

    <div class="all-cards-section">
      <h2>Vos cartes disponibles</h2>
      <div class="cards-container">
        <div
            v-for="card in storedCards"
            :key="card.id"
            class="card-item"
            :class="{ 'new-selected': cardQuantities[card.id] > 0 }"
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

    <button @click="createDeck" class="create-deck-button">
      <span class="button-content">
        <span class="button-text">Créer le deck</span>
        <span class="button-icon">→</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.create-deck-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(26, 27, 30, 0.95) 100%);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.deck-form {
  margin-bottom: 2rem;
  max-width: 500px;
}

.deck-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.deck-name-input {
  width: 100%;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: var(--card-background);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
}

.deck-name-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
}

.all-cards-section {
  margin-top: 3rem;
}

.cards-container {
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

.quantity-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.quantity-btn:not(:disabled):hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-primary);
}

.quantity-btn:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity {
  font-size: 1rem;
  font-weight: 600;
  min-width: 48px;
  text-align: center;
  color: var(--text-primary);
}

.create-deck-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-primary);
  z-index: 1000;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-icon {
  transition: var(--transition);
}

.create-deck-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(108, 99, 255, 0.3);
}

.create-deck-button:hover .button-icon {
  transform: translateX(5px);
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
  .create-deck-container {
    padding: 1rem;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .create-deck-button {
    bottom: 1rem;
    right: 1rem;
    padding: 0.8rem 1.5rem;
  }
}
</style>