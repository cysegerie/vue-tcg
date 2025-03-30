<script setup>
import {computed, onMounted, ref} from 'vue';
import {fetchCards} from '@/services/CardService.js';

const storedCards = ref([]);
const selectedCards = ref([]);
const cardQuantities = ref({});
const availableQuantities = ref({});
const newCardObtained = ref(null);

onMounted(() => {
  const allCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
  storedCards.value = allCards;
  
  allCards.forEach(card => {
    availableQuantities.value[card.id] = (availableQuantities.value[card.id] || 0) + 1;
    cardQuantities.value[card.id] = 0;
  });
});

const countedCards = computed(() => {
  const cardCount = {};
  storedCards.value.forEach(card => {
    if (cardCount[card.id]) {
      cardCount[card.id].quantity += 1;
    } else {
      cardCount[card.id] = { ...card, quantity: 1 };
    }
  });
  return Object.values(cardCount);
});

const toggleCardSelection = (card) => {
  const currentQuantity = cardQuantities.value[card.id] || 0;
  const availableQuantity = availableQuantities.value[card.id] || 0;
  
  if (currentQuantity < availableQuantity) {
    cardQuantities.value[card.id] = currentQuantity + 1;
    selectedCards.value.push(card);
  } else {
    cardQuantities.value[card.id] = 0;
    selectedCards.value = selectedCards.value.filter(c => c.id !== card.id);
  }
};

const destroyCardsAndGetNew = async () => {
  if (selectedCards.value.length !== 4) return;

  let updatedCards = [...storedCards.value];
  selectedCards.value.forEach(selectedCard => {
    const index = updatedCards.findIndex(card => card.id === selectedCard.id);
    if (index !== -1) {
      updatedCards.splice(index, 1);
    }
  });

  const allCards = await fetchCards();
  const newCard = allCards[Math.floor(Math.random() * allCards.length)];
  updatedCards.push(newCard);

  window.localStorage.setItem('boosterCards', JSON.stringify(updatedCards));
  storedCards.value = updatedCards;
  selectedCards.value = [];
  cardQuantities.value = {};
  
  updatedCards.forEach(card => {
    availableQuantities.value[card.id] = (availableQuantities.value[card.id] || 0) + 1;
    cardQuantities.value[card.id] = 0;
  });

  newCardObtained.value = newCard;

  setTimeout(() => {
    newCardObtained.value = null;
  }, 5000);
};
</script>

<template>
  <h1>Home</h1>
  <h2>Vos cartes</h2>

  <div v-if="countedCards.length">
    <div class="cards-container">
      <div
          v-for="card in countedCards"
          :key="card.id"
          class="card-item"
          :class="{ 'selected': cardQuantities[card.id] > 0 }"
          @click="toggleCardSelection(card)"
      >
        <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
        <p class="card-name">{{ card.name }}</p>
        <p class="card-id">ID: {{ card.id }}</p>
        <p class="card-quantity">Quantité: {{ card.quantity }}</p>
        <p class="selected-quantity" v-if="cardQuantities[card.id] > 0">
          Sélectionnée: {{ cardQuantities[card.id] }}
        </p>
      </div>
    </div>

    <button
        @click="destroyCardsAndGetNew"
        :disabled="selectedCards.length !== 4"
        class="destroy-button"
    >
      <p v-if="selectedCards.length !== 4">Sélectionnez 4 cartes pour les sacrifier</p>
      <p v-else>Sacrifier les cartes et en obtenir une nouvelle !</p>
    </button>
  </div>
  <div v-else>
    <p>Vous n'avez obtenu aucune carte.</p>
  </div>

  <div v-if="newCardObtained" class="new-card-popup" @click="newCardObtained = null">
    <h2>🎉 Nouvelle Carte Obtenue ! 🎉</h2>
    <img :src="newCardObtained.image ? `${newCardObtained.image}/low.jpg` : '/placeholder.jpg'" alt="Nouvelle carte" />
    <p>{{ newCardObtained.name }}</p>
  </div>
</template>

<style scoped>
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

.destroy-button {
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
}

.destroy-button:hover {
  box-shadow: 0 0 25px rgba(255, 99, 71, 1);
}

.destroy-button:disabled {
  background: #555;
  cursor: not-allowed;
  box-shadow: none;
}

.new-card-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: linear-gradient(145deg, #222, #333);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow:0 5px 20px rgba(255, 255, 255, 0.8);
  animation: popup 0.4s ease-in-out forwards;
}

.new-card-popup h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #ffffff;
}

.new-card-popup img {
  max-width: 180px;
  margin: 1rem 0;
  border-radius: 10px;
  box-shadow: 0  0  20px rgba(255, 255, 255, 0.7);
}

@keyframes popup {
  from {
    transform: translate(-50%, -50%) scale(0.7);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.card-quantity {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.selected-quantity {
  margin: 0;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.9rem;
}

.card-item.selected {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
}

.card-item.selected::before {
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
</style>