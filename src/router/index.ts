import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import MovieListView from '../views/MovieListView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: MovieListView },
  { path: '/filme/:id', component: MovieDetailView },
  { path: '/favoritos', component: FavoritesView },
  { path: '/login', component: LoginView },
  { path: '/cadastro', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
