<script setup>
import { onMounted, ref } from 'vue';
import { fetchCards } from '@/services/CardService';

const isLoading = ref(true);
const selectedCard = ref(null);

const props = defineProps({
    id: String
});

onMounted(async () => {
    selectedCard.value = await fetchCards(props.id);
    isLoading.value = false;
});
</script>

<template>
    <div v-if="isLoading">Loading...</div>
    <div v-else class="card-container">
        <h2>{{ selectedCard.name }}</h2>
        <a :href="`${selectedCard.image}/low.jpg`" target="_blank">
            <img :src="`${selectedCard.image}/low.jpg`" alt="Card Image" class="card-image"/>
        </a>
        <div class="info-columns">
            <div class="column">
                <h3>Capacité(s) :</h3>
                <p v-for="attack in selectedCard.attacks" class="text-card">
                    {{ attack.name }} - {{ attack.effect }}
                </p>
            </div>
            <div class="column">
                <h3>Type(s) :</h3>
                <div class="types">
                    <span v-for="type in selectedCard.types" :key="type" class="text-card">{{ type }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-image{
    margin-bottom: 2rem;
}
.card-image:hover {
    transform: scale(1.1);
}
.card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    color: #333;
}
.card-container h2 {
    margin-bottom: 2rem;
}
.card-container img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.info-columns {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.column {
    flex: 1;
    padding: 0 1rem;
}

.types {
    display: flex;
    flex-direction: column;
}

.text-card {
    color: #333;
    text-decoration: none;
    font-size: 1.2rem;
}
</style>