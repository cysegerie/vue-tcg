import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router";

import OpenBooster from "@/components/OpenBooster.vue";
import AllMyCards from "@/components/AllMyCards.vue";
import MyDecks from "@/components/MyDecks.vue";
import Home from "@/components/Home.vue";
import SelectedCard from "@/components/SelectedCard.vue";
import ShowDecks from "@/components/ShowDecks.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/open-booster', component: OpenBooster },
    { path: '/all-my-cards', component: AllMyCards },
    { path: '/my-decks', component: MyDecks },
    { path: '/cards/:id', component: SelectedCard, props: true },
    { path: '/show-decks/:deckId', name: 'ShowDecks', component: ShowDecks }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App)
    .use(router)
    .mount('#app');