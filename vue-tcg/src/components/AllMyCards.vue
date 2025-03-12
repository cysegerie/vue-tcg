<script setup>
import { ref, onMounted } from 'vue';
import { fetchCardsByPage } from '@/services/CardService.js';
import { RouterLink } from 'vue-router';

// fix ts

const isLoading = ref(true);
const cards = ref([]);
const itemsPerPage = 20;

const props = defineProps({
    currentPage: {type: Number, default: 1}
});

onMounted(async () => {
    isLoading.value = true;
    cards.value = await fetchCardsByPage(props.currentPage, itemsPerPage);
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1 class="h1-title">All My Cards</h1>
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="cards.length <= 0">
            <p>No cards found</p>
        </div>
        <div v-else>
            <div class="cards-container">
            <div v-for="card in cards" :key="card.id" class="card-item">
                <RouterLink :to="`/cards/${card.id}`" class="card-link">
                <img :src="`${card.image}/low.jpg`" alt="Card Image" />
                <p>{{ card.name }}</p>
                </RouterLink>
            </div>
            </div>
            <div class="pagination">
            <RouterLink v-if="props.currentPage != 1" :to="`/all-my-cards/${props.currentPage - 1}`">
                <button :disabled="props.currentPage === 1">Previous</button>
            </RouterLink>
            <span>{{ props.currentPage }}</span>
            <RouterLink :to="`/all-my-cards/${props.currentPage + 1}`">
                <button>Next</button>
            </RouterLink>
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
}
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