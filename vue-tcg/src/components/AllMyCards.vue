<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchCards } from '@/services/CardService.js';

const isLoading = ref(true);
const cards = ref([]);
const currentPage = ref(1);
const itemsPerPage = 20; // Augmenter le nombre d'éléments par page

const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return cards.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(cards.value.length / itemsPerPage);
});

onMounted(async () => {
    isLoading.value = true;
    cards.value = await fetchCards();
    isLoading.value = false;
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
</script>

<template>
    <div>
        <h1 class="h1-title">All My Cards</h1>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <div class="cards-container">
                <div v-for="card in paginatedCards" :key="card.id" class="card-item">
                    <img :src="`${card.image}/low.jpg`" alt="image" />
                    <p>{{ card.name }}</p>
                </div>
            </div>
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.h1-title {
    text-align: center;
    margin-bottom: 1rem;
}
.cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem; /* Réduire l'espace entre les cartes */
    justify-content: center;
}

.card-item {
    background-color: #333;
    color: #fff;
    padding: 0.5rem; /* Réduire le padding */
    border-radius: 8px;
    text-align: center;
    width: calc(100% / 5 - 1rem); /* Réduire la largeur des cartes */
}

.card-item img {
    max-width: 100%;
    border-radius: 8px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}

.pagination button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
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
</style>