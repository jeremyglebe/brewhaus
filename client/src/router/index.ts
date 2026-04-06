import { createRouter, createWebHistory } from 'vue-router'
import BreweryList from '@/views/pages/BreweryList.vue'
import BreweryListView from '@/views/BreweryListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'brewery-list',
      component: BreweryList,
    },
    {
      path: '/poc',
      name: 'brewery-list-poc',
      component: BreweryListView,
    },
  ],
})

export default router
