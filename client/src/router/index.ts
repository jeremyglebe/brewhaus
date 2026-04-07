import { createRouter, createWebHistory } from 'vue-router';
import ListPage from '@/views/pages/ListPage.vue';
import ListPageInfinite from '@/views/pages/ListPageInfinite.vue';
import ListPagePaginated from '@/views/pages/ListPagePaginated.vue';
import SearchPage from '@/views/pages/SearchPage.vue';
import SettingsPage from '@/views/pages/SettingsPage.vue';
import DetailPage from '@/views/pages/DetailPage.vue';

// Routing strategy:
// - `/` is a lightweight handoff route that redirects to the saved list mode.
// - list/search pages can open detail content in a modal for in-context browsing.
// - `/brewery/:id` remains available as a standalone page for deep links and favorites.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/list',
      name: 'list',
      component: ListPage,
    },
    {
      path: '/list/infinite',
      name: 'list-infinite',
      component: ListPageInfinite,
    },
    {
      path: '/list/paginated',
      name: 'list-paginated',
      component: ListPagePaginated,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
    },
    {
      path: '/brewery/:id',
      name: 'brewery-detail',
      component: DetailPage,
    },
  ],
});

export default router;
