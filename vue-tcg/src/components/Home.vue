<script setup>
import { ref, onMounted, computed } from 'vue';

const storedCards = ref([]);

onMounted(() => {
  const savedCards = JSON.parse(window.localStorage.getItem('boosterCards')) || [];
  storedCards.value = savedCards;
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
</script>

<template>
  <h1>Cartes Obtenues</h1>

  <div v-if="countedCards.length">
    <div class="cards-container">
      <div v-for="card in countedCards" :key="card.id" class="card-item">
        <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
        <p>{{ card.name }}</p>
        <p>Quantité: {{ card.quantity }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Vous n'avez obtenu aucune carte.</p>
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
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}
</style>