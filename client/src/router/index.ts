import { createRouter, createWebHistory } from 'vue-router'
import BreweryListView from '../views/BreweryListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BreweryListView,
    },
  ],
})

export default router
