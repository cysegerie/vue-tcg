<script setup>

import {ref, watch} from 'vue';
import { fetchCards } from '@/services/CardService.js';


const randomCards = ref([]);
const exCards = ref([]);

const openRandomBooster = async () => {

  const allCards = await fetchCards();
  randomCards.value = allCards.sort(() => 0.5 - Math.random()).slice(0, 1);


};

watch(randomCards, (newCards) => {
  const storedCards = JSON.parse(window.localStorage.getItem('randomCards')) || [];
  const updatedCards = [...storedCards, ...newCards];
  window.localStorage.setItem('randomCards', JSON.stringify(updatedCards));
});

const deleteLocalStorage = () => {
  window.localStorage.removeItem('randomCards');
  randomCards.value = [];
};


/* i've try to create another lsit in local storage for ex cards but it doesn't work because all is going into the same list
const openExBooster = async () => {
  const allExCards = await fetchCards();
  const exCards = allExCards.filter(card => / ex$/i.test(card.name));
  randomCards.value = exCards.sort(() => 0.5 - Math.random()).slice(0, 1);

};


watch(exCards, (newExCards) => {
  const storedExCards = JSON.parse(window.localStorage.getItem('exCards')) || [];
  const updatedExCards = [...storedExCards, ...newExCards];
  window.localStorage.setItem('exCards', JSON.stringify(updatedExCards));
});
*/



</script>

<template>
  <h1>Open Booster</h1>

  <button @click="openRandomBooster">Open Random Booster</button>


  <!-- <button @click="openExBooster">Open Ex Booster</button> -->


  <div v-if="randomCards.length">
    <h2>Random Booster Cards</h2>
    <div class="cards-container">
      <div v-for="card in randomCards" :key="card.id" class="card-item">
        <img :src="`${card.image}/low.jpg`" alt="image" />
        <p>{{ card.name }}</p>
      </div>
    </div>
  </div>


  <button @click="deleteLocalStorage">Delete all my cards</button>


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

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease, transform 0.3s ease;
  background-color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin: 0.5rem;
}

.nav-link:hover {
  color: #ff6347;
  transform: scale(1.1);
}
</style>