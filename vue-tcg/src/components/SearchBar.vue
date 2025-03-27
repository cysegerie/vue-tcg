<script setup>
import { ref, watch } from 'vue';

const query = ref('');
const filteredCards = ref([]);

const searchCards = () => {
  const storedCards = JSON.parse(window.localStorage.getItem('randomCards')) || [];
  
  if (query.value.length > 2) {
    filteredCards.value = storedCards.filter(card => 
      card.name.toLowerCase().includes(query.value.toLowerCase())
    );
  } else {
    filteredCards.value = [];
  }
};

watch(query, searchCards);
</script>

<template>
  <div>
    <!-- Search bar -->
    <input v-model="query" class="search-input" placeholder="Search Pokémon" />

    <!-- Cards container -->
    <div v-if="filteredCards.length" class="cards-container">
        <img 
          v-for="card in filteredCards" 
          :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" 
          alt="Card Image" 
          class="card-image" 
        />
    </div>

    <!-- No results message -->
    <div v-else-if="query.length > 2" class="no-results">No cards found</div>
  </div>
</template>

<style scoped>
/* Search bar styling */
.search-input {
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #ff6347;
  outline: none;
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
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
  background-color: #444;
}

.card-item img {
  max-width: 100%;
  border-radius: 8px;
}

.card-image {
  width: 35%;
  height: auto;
  border-radius: 8px;
}

.card-name {
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
}

.no-results {
  color: #888;
  font-size: 1.2rem;
  margin-top: 1rem;
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

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.booster-btn {
  background-color: #ff6347;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: block;
  margin: 0 auto 1rem;
}

.open-booster-btn:hover {
  background-color: #e5533d;
  transform: scale(1.05);
}
</style>
