<script setup>
import { ref, onMounted } from 'vue';

const boosters = ref([]);
const selectedCard = ref(null);
const loading = ref(false);
const error = ref(null);
const storedCards = ref([]);

// Charger la liste des boosters
const fetchBoosters = async () => {
  try {
    const response = await fetch('https://67b8eac151192bd378dc35a6.mockapi.io/boosters');
    boosters.value = await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des boosters :', error);
  }
};

// Tirer une seule carte d'un booster
const openBooster = async (booster) => {
  loading.value = true;
  selectedCard.value = null;

  if (!booster.cards || booster.cards.length === 0) {
    console.error('Aucune carte disponible dans ce booster');
    loading.value = false;
    return;
  }

  const randomCardId = booster.cards[Math.floor(Math.random() * booster.cards.length)];

  try {
    const response = await fetch(`https://api.tcgdex.net/v2/fr/cards/${randomCardId}`);
    const card = await response.json();
    console.log("Carte récupérée :", card);
    selectedCard.value = card;

    // Sauvegarde dans le localStorage
    const stored = JSON.parse(localStorage.getItem('boosterCards')) || [];
    stored.push(card);
    localStorage.setItem('boosterCards', JSON.stringify(stored));
    storedCards.value = stored;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la carte ${randomCardId} :`, error);
  }

  loading.value = false;
};

// Récupérer les cartes stockées en lcoal
const loadStoredCards = () => {
  storedCards.value = JSON.parse(localStorage.getItem('boosterCards')) || [];
};

// Supprimer les cartes stockées
const clearLocalStorage = () => {
  localStorage.removeItem('boosterCards');
  selectedCard.value = null;
  storedCards.value = [];
};

onMounted(() => {
  fetchBoosters();
  loadStoredCards();
});
</script>

<template>
  <h1>Ouvrir un Booster</h1>

  <div v-if="error" class="error">{{ error }}</div>

  <div v-if="boosters.length">
    <h2>Choisissez un Booster</h2>
    <div class="boosters-container">
      <button v-for="booster in boosters" :key="booster.id" @click="openBooster(booster)" class="booster-button">
        {{ booster.name }}
      </button>
    </div>
  </div>

  <div v-if="loading" class="loading">Chargement...</div>

  <div v-if="selectedCard" class="card-container">
    <h2>Carte obtenue</h2>
    <div class="card-item">
      <RouterLink :to="`/cards/${selectedCard.id}`" class="card-link">
        <img :src="selectedCard.image ? `${selectedCard.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
        <p>{{ selectedCard.name }}</p>
      </RouterLink>
    </div>
  </div>



  <button @click="clearLocalStorage" class="clear-button">Supprimer toutes mes cartes</button>
</template>

<style scoped>
.boosters-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.booster-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.booster-button:hover {
  background-color: #0056b3;
}

.card-container {
  text-align: center;
}

.card-item {
  background-color: #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  width: 200px;
  margin: auto;
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}

.card-link {
  text-decoration: none;
  color: #fff;
}

.card-link:hover {
  text-decoration: underline;
  color: #ff6347;
}

.clear-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.clear-button:hover {
  background-color: #a71d2a;
}

.loading {
  text-align: center;
  font-weight: bold;
  color: #007bff;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
}

</style>