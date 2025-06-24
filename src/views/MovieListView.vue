<template>
  <div class="main-container">
    <div class="top-bar">
      <input v-model="search" @input="fetchMovies" placeholder="Pesquisar por título..." class="search-input" />
      <GenreFilter :genres="genres" v-model="selectedGenres" @update:selectedGenres="fetchMovies" />
      <router-link to="/favoritos" class="fav-link">Favoritos ♥</router-link>
    </div>
    <div class="movies-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" :favorite="isFavorite(movie.id)" @toggle-favorite="toggleFavorite" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../api/axios';
import MovieCard from '../components/MovieCard.vue';
import GenreFilter from '../components/GenreFilter.vue';
import { useRouter } from 'vue-router';

const movies = ref([])
const genres = ref([])
const selectedGenres = ref([])
const search = ref('')
const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const router = useRouter()

function isFavorite(id: number) {
  return favorites.value.includes(id)
}
function toggleFavorite(movie: any) {
  const idx = favorites.value.indexOf(movie.id)
  if (idx === -1) favorites.value.push(movie.id)
  else favorites.value.splice(idx, 1)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
async function fetchMovies() {
  let url = '/filmes?'
  if (search.value) url += `titulo=${encodeURIComponent(search.value)}&`
  if (selectedGenres.value.length) url += `genero=${selectedGenres.value.join(',')}`
  const { data } = await api.get(url)
  movies.value = data
}
async function fetchGenres() {
  const { data } = await api.get('/generos')
  genres.value = data
}
onMounted(() => {
  fetchGenres()
  fetchMovies()
})
watch(selectedGenres, fetchMovies)
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}
.search-input {
  flex: 1;
  min-width: 220px;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #292929;
  color: #fff;
  font-size: 1rem;
}
.fav-link {
  color: #e74c3c;
  background: #232323;
  border-radius: 0.75rem;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}
.fav-link:hover {
  background: #333;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}
</style>
