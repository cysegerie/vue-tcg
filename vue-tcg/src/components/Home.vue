<script setup>
import { ref, onMounted, computed } from 'vue';

const storedCards = ref([]);

onMounted(() => {
  const savedCards = JSON.parse(window.localStorage.getItem('randomCards')) || [];
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
  <h1>Home</h1>

  <div v-if="countedCards.length">
    <h2>My Collected Cards</h2>
    <div class="cards-container">
      <div v-for="card in countedCards" :key="card.id" class="card-item">
        <img :src="`${card.image}/low.jpg`" alt="image" />
        <p>{{ card.name }}</p>
        <p>Quantity: {{ card.quantity }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No cards collected yet. Open a booster to get some!</p>
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
