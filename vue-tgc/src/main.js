import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import OpenBooster from "@/components/OpenBooster.vue";
import AllMyCards from "@/components/AllMyCards.vue";
import MyDecks from "@/components/MyDecks.vue";
import {createRouter, createWebHistory} from "vue-router";
import Home from "@/components/Home.vue";


const routes = [
    { path: '/', component: Home},
    { path: '/open-booster', component: OpenBooster},
    { path: '/all-my-cards', component: AllMyCards},
    { path: '/my-decks', component: MyDecks},
  ];
const router = createRouter({
    history: createWebHistory(),
    routes,
  });

createApp(App)
    .use(router)
    .mount('#app');
