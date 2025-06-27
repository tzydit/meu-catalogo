import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import MovieListView from '../views/MovieListView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import CreateMovieView from '../views/CreateMovieView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: MovieListView },
  { path: '/movies/:id', component: MovieDetailView }, // alterado para alinhar com o endpoint do back-end
  { path: '/favoritos', component: FavoritesView },
  { path: '/login', component: LoginView },
  { path: '/cadastro', component: RegisterView },
  { path: '/perfil', component: ProfileView },
  { path: '/criar-filme', component: CreateMovieView },
  { path: '/gerenciar-filmes', component: () => import('../views/ManageMoviesView.vue') },
  { path: '/editar-filme/:id', component: () => import('../views/EditMovieView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
