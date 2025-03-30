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
.selected-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: var(--background-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-primary);
  max-width: 800px;
  margin: 2rem auto;
}

.card-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-primary);
}

.card-info {
  text-align: center;
  color: white;
}

.card-name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.card-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  color: white;
}

.detail-item {
  background: var(--background-primary);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-secondary);
}

.detail-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.detail-value {
  color: white;
}

.card-description {
  margin: 1.5rem 0;
  line-height: 1.6;
  color: white;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-color);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: var(--transition);
}

.action-button:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.action-button:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .selected-card {
    padding: 1rem;
    margin: 1rem;
  }

  .card-name {
    font-size: 1.5rem;
  }

  .card-details {
    grid-template-columns: 1fr;
  }
}
</style>