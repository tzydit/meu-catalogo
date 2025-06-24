<template>
  <div class="main-container">
    <h1>Meus Favoritos</h1>
    <div class="movies-grid">
      <MovieCard v-for="movie in favoriteMovies" :key="movie.id" :movie="movie" :favorite="true" @toggle-favorite="toggleFavorite" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import MovieCard from '../components/MovieCard.vue';

const favoriteIds = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
const favoriteMovies = ref<any[]>([])

async function fetchFavorites() {
  if (!favoriteIds.value.length) {
    favoriteMovies.value = []
    return
  }
  const { data } = await api.get('/filmes')
  favoriteMovies.value = data.filter((m: any) => favoriteIds.value.includes(m.id))
}
function toggleFavorite(movie: any) {
  const idx = favoriteIds.value.indexOf(movie.id)
  if (idx === -1) favoriteIds.value.push(movie.id)
  else favoriteIds.value.splice(idx, 1)
  localStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
  fetchFavorites()
}
onMounted(fetchFavorites)
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}
h1 {
  color: #fff;
  margin-bottom: 2rem;
}
</style>
