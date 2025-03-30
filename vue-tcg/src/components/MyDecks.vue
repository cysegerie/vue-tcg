<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_API_DECKS } from '@/utilities/const.js';
import { apiGet, apiPost, apiDelete } from '@/services/ApiService.js';

const decks = ref([]);
const router = useRouter();
const newDeckName = ref('');
const newDeckCards = ref('');
const errorMessage = ref('');

const fetchDecks = async () => {
  try {
    decks.value = await apiGet(BASE_API_DECKS);
  } catch (error) {
    console.error('Error fetching decks:', error);
  }
};

const addDeck = async () => {
  if (!newDeckName.value || !newDeckCards.value) {
    errorMessage.value = 'All fields are required';
    return;
  }

  const newDeck = {
    name: newDeckName.value,
    idUser: Math.floor(Math.random() * 10) + 1,
    cards: newDeckCards.value.split(',').map(card => card.trim())
  };

  try {
    await apiPost(BASE_API_DECKS, newDeck);
    newDeckName.value = '';
    newDeckCards.value = '';
    errorMessage.value = '';
    await fetchDecks();
  } catch (error) {
    console.error('Error adding deck:', error);
  }
};

const goToShowDecks = (deckId) => {
  router.push({ name: 'ShowDecks', params: { deckId } });
};

const goToCreateDeck = () => {
  router.push('/create-deck');
};

const deleteFirstTenDecks = async () => {
  try {
    const allDecks = await apiGet(BASE_API_DECKS);
    const decksToDelete = allDecks.slice(0, 10);

    for (const deck of decksToDelete) {
      await apiDelete(`${BASE_API_DECKS}/${deck.id}`);
    }

    await fetchDecks();
    window.location.reload(); // Actualiser la page
  } catch (error) {
    console.error('Error deleting decks:', error);
  }
};

onMounted(() => {
  fetchDecks();
});
</script>

<template>
  <div class="container">
    <h1 class="title">Mes Decks</h1>

    <div class="actions">
      <button @click="goToCreateDeck" class="action-button create-button">
        <span class="button-content">
          <span class="button-text">Créer un nouveau deck</span>
          <span class="button-icon">+</span>
        </span>
      </button>
      <button @click="deleteFirstTenDecks" class="action-button delete-button">
        <span class="button-content">
          <span class="button-text">Supprimer les 10 premiers decks</span>
          <span class="button-icon">🗑️</span>
        </span>
      </button>
    </div>

    <div class="add-deck-form">
      <h2>Ajouter un nouveau deck</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="form-group">
        <label for="deckName">Nom du deck</label>
        <input 
          id="deckName" 
          v-model="newDeckName" 
          placeholder="Entrez le nom du deck (ex: Alexandre Ruiz le goat)" 
          class="input" 
        />
      </div>
      <div class="form-group">
        <label for="deckCards">IDs des cartes (séparés par des virgules)</label>
        <input 
          id="deckCards" 
          v-model="newDeckCards" 
          placeholder="Ex: xy1-1, xy1-2, xy1-3" 
          class="input" 
        />
      </div>
      <button @click="addDeck" class="submit-button">
        <span class="button-content">
          <span class="button-text">Ajouter le deck</span>
          <span class="button-icon">→</span>
        </span>
      </button>
    </div>

    <div class="decks-grid">
      <div 
        v-for="deck in decks" 
        :key="deck.id" 
        @click="goToShowDecks(deck.id)" 
        class="deck-card"
      >
        <div class="deck-content">
          <h3 class="deck-name">{{ deck.name }}</h3>
          <div class="deck-info">
            <span class="deck-count">{{ deck.cards.length }} cartes</span>
            <span class="deck-id">ID: {{ deck.id }}</span>
          </div>
        </div>
        <div class="deck-hover-effect"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(26, 27, 30, 0.95) 100%);
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  flex: 1;
  min-width: 200px;
}

.create-button {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.delete-button {
  background: var(--gradient-secondary);
  color: white;
  box-shadow: var(--shadow-secondary);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(108, 99, 255, 0.3);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  transition: var(--transition);
}

.action-button:hover .button-icon {
  transform: scale(1.1);
}

.add-deck-form {
  background: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: var(--background-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-primary);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-primary);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(108, 99, 255, 0.3);
}

.decks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.deck-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.deck-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-primary);
}

.deck-content {
  position: relative;
  z-index: 1;
}

.deck-name {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.deck-info {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.deck-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(108, 99, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: var(--transition);
}

.deck-card:hover .deck-hover-effect {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }

  .decks-grid {
    grid-template-columns: 1fr;
  }
}
</style>