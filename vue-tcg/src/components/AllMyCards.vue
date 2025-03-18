<script setup>
import { ref, onMounted, watch } from 'vue';
import { fetchCardsByPage } from '@/services/CardService.js';
import { RouterLink } from 'vue-router';

const isLoading = ref(true);
const cards = ref([]);
const itemsPerPageOptions = [10, 25, 50];
const itemsPerPage = ref(itemsPerPageOptions[0]);

const currentPage = ref(1);

function loadCards(page) {
    isLoading.value = true;

    fetchCardsByPage(page, itemsPerPage.value).then((data) => {
        cards.value = data;
        isLoading.value = false;
    });
}

onMounted(() => {
    loadCards(currentPage.value);
});


watch([currentPage, itemsPerPage], ([newPage, newItemsPerPage], [oldPage, oldItemsPerPage]) => {
    loadCards(newPage);
});
    
</script>

<template>
    <div>
        <h1 class="h1-title">All My Cards</h1>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <div class="pagination">
                <select v-model="itemsPerPage">
                    <option v-for="itemp in itemsPerPageOptions" :key="itemp" :value="itemp">
                        {{ itemp }}
                    </option>
                </select>
                <div class="pagination-trucs">
                    <button :disabled="currentPage === 1" @click="currentPage -= 1">Previous</button>
                    <span>Page {{ currentPage }}</span>
                    <button :disabled="cards.length < itemp" @click="currentPage += 1">Next</button>
                </div>
            </div>
            <div class="cards-container">
                <div v-for="card in cards" :key="card.id" class="card-item">
                    <RouterLink :to="`/cards/${card.id}`" class="card-link">
                        <img :src="`${card.image}/low.jpg`" alt="Card Image" />
                        <p>{{ card.name }}</p>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>  
</template>

<style scoped>
.card-link {
    text-decoration: none;
    color: #fff;
}
.card-link:hover {
    text-decoration: underline;
    color: #ff6347;
}
.h1-title {
    text-align: center;
    margin-bottom: 1rem;
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
}

.card-item img {
    max-width: 100%;
    border-radius: 8px;
}

.pagination {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.pagination select {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #333;
}

.pagination button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.pagination button:hover {
    background-color: #ff6347;
    transform: scale(1.1);
}

.pagination button:disabled {
    background-color: #555;
    cursor: not-allowed;
}

.pagination-trucs{
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-right: 1.5rem;
}
</style>
