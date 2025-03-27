<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { fetchCardsByPage } from '@/services/CardService.js';
import { RouterLink } from 'vue-router';

const isLoading = ref(false);
const cards = ref([]);
const totalFetched = ref(0);
const currentPageApi = ref(1);

const itemsPerPageOptions = [10, 25, 50, 100];
const savedItemsPerPage = localStorage.getItem('itemsPerPage');
const itemsPerPage = ref(savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 10);
const currentPage = ref(1);

async function loadMoreCards() {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        const data = await fetchCardsByPage(currentPageApi.value, 100);
        if (data.length > 0) {
            cards.value.push(...data);
            totalFetched.value += data.length;
            currentPageApi.value += 1;
        }
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    loadMoreCards();
});

watch(itemsPerPage, (newVal) => {
    localStorage.setItem('itemsPerPage', newVal);
    currentPage.value = 1;
});

const displayedCards = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return cards.value.slice(start, end);
});

watch(currentPage, async (newPage) => {
    if (newPage * itemsPerPage.value >= totalFetched.value) {
        await loadMoreCards();
    }
});
</script>

<template>
    <div>
        <h1 class="h1-title">All My Cards</h1>
        <div v-if="isLoading && cards.length === 0">Loading...</div>
        <div v-else>
            <div class="pagination">
                <label for="itemsPerPage">Cartes par page :</label>
                <select v-model="itemsPerPage" id="itemsPerPage">
                    <option v-for="itemp in itemsPerPageOptions" :key="itemp" :value="itemp">
                        {{ itemp }}
                    </option>
                </select>
                <div class="pagination-trucs">
                    <button :disabled="currentPage === 1" @click="currentPage -= 1">Previous</button>
                    <span>Page {{ currentPage }}</span>
                    <button :disabled="isLoading" @click="currentPage += 1">Next</button>
                </div>
            </div>
            <div class="cards-container">
                <div v-for="card in displayedCards" :key="card.id" class="card-item">
                    <RouterLink :to="`/cards/${card.id}`" class="card-link">
                        <img :src="card.image ? `${card.image}/low.jpg` : '/placeholder.jpg'" alt="Card Image" />
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
.pagination-trucs {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-right: 1.5rem;
}
</style>
